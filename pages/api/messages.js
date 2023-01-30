import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

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
                { recipient: ObjectId(session?.user?._id) },
                { author: ObjectId(session?.user?._id) },
              ],
            },
          },
        ])
        .toArray()
        .then((results) => response.status(200).send(results))
        .finally(() => client.close());
      break;
    case "POST":
      await collection
        .insertOne({
          recipient: ObjectId(body?.to),
          body: body?.body,
          author: ObjectId(session?.user?._id),
          isRead: false,
          createdAt: new Date(),
        })
        .then(() =>
          response.status(200).send("Good things come to those who wait.")
        )
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
