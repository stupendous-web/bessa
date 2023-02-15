import { MongoClient } from "mongodb";

export default async function handler(request, response) {
  const body = request.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  switch (request.method) {
    case "POST":
      await collection
        .aggregate([
          { $match: { "settings.emailNotifications": body?.interval } },
        ])
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
