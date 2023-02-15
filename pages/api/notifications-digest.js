import { MongoClient, ObjectId } from "mongodb";

export default async function handler(request, response) {
  const client = new MongoClient(process.env.MONGO_DB_URI);

  switch (request.method) {
    case "POST":
      response.send("Good things come to those who wait.");
      break;
    default:
      response.status(405).send();
  }
}
