import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const body = request.body;
  const query = request.query;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("likes");
  await client.connect();

  const req = request;
  const res = response;
  const session = await getServerSession(req, res, authOptions);

  switch (request.method) {
    case "POST":
      await collection
        .insertOne({
          postId: new ObjectId(body?.postId),
          userId: new ObjectId(session?.user?._id),
        })
        .then(
          async () =>
            await client
              .db("bessa")
              .collection("notifications")
              .insertOne({
                type: "like",
                isRead: false,
                postId: new ObjectId(body?.postId),
                recipientId: new ObjectId(body?.userId),
                authorId: new ObjectId(session?.user?._id),
                createdAt: new Date(),
              })
              .then(() =>
                response.status(200).send("Good things come to those who wait.")
              )
              .finally(() => client.close())
        )
        .finally(() => client.close());

      break;
    case "DELETE":
      await collection
        .deleteOne({ _id: new ObjectId(query?.likeId) })
        .then(() =>
          // TODO: Delete Notification

          response.status(200).send("Good things come to those who wait.")
        )
        .finally(() => client.close());

      break;
    default:
      response.status(405).send();
  }
}
