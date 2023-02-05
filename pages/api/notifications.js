import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("notifications");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "GET":
      await collection
        .find({ recipientId: ObjectId(session?.user?._id) })
        .toArray()
        .then((results) => response.send(results))
        .finally(() => client.close());

      break;
    default:
      response.status(405).send();
  }
}
