import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("notifications");
  await client.connect();

  const req = request;
  const res = response;
  const session = await getServerSession(req, res, authOptions);

  switch (request.method) {
    case "GET":
      await collection
        .aggregate([
          { $match: { recipientId: new ObjectId(session?.user?._id) } },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "authorMeta",
              pipeline: [{ $project: { _id: 1, name: 1 } }],
            },
          },
          { $sort: { createdAt: -1 } },
        ])
        .toArray()
        .then((results) => response.send(results))
        .finally(() => client.close());

      break;
    case "PATCH":
      await collection
        .updateMany(
          { recipientId: new ObjectId(session?.user?._id) },
          {
            $set: { isRead: true },
          }
        )
        .then(() => response.send("Good things come to those who wait."))
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
