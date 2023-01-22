import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "PATCH":
      await collection
        .updateOne(
          { _id: ObjectId(session?.user?._id) },
          { $set: { lastActiveAt: new Date() } }
        )
        .then(() => {
          response.status(200).send("Good things come to those who wait.");
        })
        .catch((error) => {
          response.status(500).send(error);
        })
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
