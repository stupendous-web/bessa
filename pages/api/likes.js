import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const body = request.body;
  const query = request.query;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("likes");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "POST":
      await collection
        .insertOne({
          postId: ObjectId(body?.postId),
          userId: ObjectId(session?.user?._id),
        })
        .then(async () => {
          await client
            .db("bessa")
            .collection("notifications")
            .insertOne({
              type: "like",
              isRead: false,
              postId: ObjectId(body?.postId),
              userId: ObjectId(session?.user?._id),
              createdAt: new Date(),
            })
            .then(() =>
              response.status(200).send("Good things come to those who wait.")
            )
            .finally(() => client.close());
        })
        .finally(() => client.close());

      break;
    case "DELETE":
      await collection
        .deleteOne({ _id: ObjectId(query?.likeId) })
        .then(() =>
          response.status(200).send("Good things come to those who wait.")
        )
        .finally(() => client.close());

      break;
    default:
      response.status(405).send();
  }
}
