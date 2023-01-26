import { MongoClient } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("avatars");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "POST":
      await collection.insertOne({ userId: session?.user?._id }).finally(() => {
        client.close();

        response.status(200).send("Good things come to those who wait.");
      });
      break;
    default:
      response.status(405).send();
  }
}
