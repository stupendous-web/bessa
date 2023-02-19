import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const body = request.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("comments");
  await client.connect();

  const req = request;
  const res = response;
  const session = await getServerSession(req, res, authOptions);

  switch (request.method) {
    case "POST":
      await collection
        .insertOne({
          body: body?.comment,
          postId: new ObjectId(body?.postId),
          userId: new ObjectId(session?.user?._id),
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
