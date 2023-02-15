import { MongoClient } from "mongodb";

export default async function handler(request, response) {
  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  switch (request.method) {
    case "POST":
      await collection
        .aggregate([{ $match: { "settings.emailNotifications": "weekly" } }])
        .toArray()
        .then((results) => {
          response.json(results);
        })
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
