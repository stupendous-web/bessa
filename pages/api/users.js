import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(request, response) {
  const body = request.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  switch (request.method) {
    case "POST":
      const user = await collection.findOne({ email: body?.email });

      if (!user) {
        await collection
          .insertOne({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            createdAt: new Date(),
          })
          .finally(() => {
            client.close();

            response.status(200).send("Good things come to those who wait.");
          });
      } else {
        await client.close();

        response
          .status(422)
          .json({ title: "That email is already registered." });
      }
      break;
    default:
      response.status(405).send();
  }
}
