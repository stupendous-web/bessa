import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const query = request.query;
  const body = request.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("messages");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "GET":
      const authorMatch = [
        {
          $match: {
            $or: [
              {
                $and: [
                  { author: ObjectId(session?.user?._id) },
                  { recipient: ObjectId(query?.authorId) },
                ],
              },
              {
                $and: [
                  { author: ObjectId(query?.authorId) },
                  { recipient: ObjectId(session?.user?._id) },
                ],
              },
            ],
          },
        },
      ];
      const recipientMatch = [
        {
          $match: {
            recipient: ObjectId(query?.recipientId),
          },
        },
      ];
      const groupMatch = [
        {
          $match: { recipient: ObjectId(session?.user?._id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorMeta",
          },
        },
        {
          $group: {
            _id: { author: "$author" },
            authorMeta: {
              $first: "$authorMeta",
            },
          },
        },
      ];
      await collection
        .aggregate([
          ...(query?.authorId ? authorMatch : []),
          ...(query?.recipientId ? recipientMatch : []),
          ...(!query?.authorId && !query?.recipientId ? groupMatch : []),
        ])
        .toArray()
        .then(async (results) => {
          // Mark all as read
          query?.authorId &&
            (await collection.updateMany(
              { author: ObjectId(session?.user?._id) },
              {
                $set: { isRead: true },
              }
            ));
          response.send(results);
        })
        .finally(() => client.close());
      break;
    case "POST":
      await collection
        .insertOne({
          recipient: ObjectId(body?.recipient),
          body: body?.body,
          author: ObjectId(session?.user?._id),
          isRead: false,
          createdAt: new Date(),
        })
        .then(
          async (result) =>
            await collection
              .find({ _id: result?.insertedId })
              .toArray()
              .then((results) => response.send(results[0]))
              .finally(() => client.close())
        )
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
