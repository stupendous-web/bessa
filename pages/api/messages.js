import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const Pusher = require("pusher");

export default async function handler(request, response) {
  const body = request.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("messages");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "GET":
      await collection
        .aggregate([
          {
            $match: {
              $or: [
                { authorId: ObjectId(session?.user?._id) },
                { recipientId: ObjectId(session?.user?._id) },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "authorMeta",
            },
          },
        ])
        .toArray()
        .then((results) => response.send(results))
        .finally(() => client.close());
      break;
    case "PATCH":
      await collection
        .updateMany(
          {
            $and: [
              { recipientId: ObjectId(session?.user?._id) },
              { authorId: ObjectId(body?.authorId) },
            ],
          },
          {
            $set: { isRead: true },
          }
        )
        .then(() => response.send("Good things come to those who wait."))
        .finally(() => client.close());
      break;
    case "POST":
      await collection
        .insertOne({
          recipientId: ObjectId(body?.recipientId),
          body: body?.body,
          isRead: false,
          authorId: ObjectId(session?.user?._id),
          createdAt: new Date(),
        })
        .then(async (result) => {
          await collection
            .aggregate([
              { $match: { _id: result?.insertedId } },
              {
                $lookup: {
                  from: "users",
                  localField: "authorId",
                  foreignField: "_id",
                  as: "authorMeta",
                },
              },
            ])
            .toArray()
            .then(async (results) => {
              const pusher = await new Pusher({
                appId: process.env.PUSHER_APP_ID,
                key: process.env.NEXT_PUBLIC_PUSHER_KEY,
                secret: process.env.PUSHER_SECRET,
                cluster: "us3",
                useTLS: true,
              });
              await pusher.trigger(`${body?.recipientId}`, "new-message", {
                message: results[0],
              });

              response.send(results[0]);
            })
            .finally(() => client.close());
        })
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
