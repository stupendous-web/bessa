import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const { Storage } = require("@google-cloud/storage");

export default async function handler(request, response) {
  const body = request.body;
  const query = request.query;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  const storage = new Storage({
    project_id: "stupendous-web",
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: process.env.GCS_PRIVATE_KEY,
    },
  });

  switch (request.method) {
    case "GET":
      const geoNear = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [
                parseFloat(query.longitude),
                parseFloat(query.latitude),
              ],
            },
            distanceField: "distance",
            spherical: true,
          },
        },
      ];
      const match = [
        {
          $match: {
            _id: new ObjectId(query.userId),
          },
        },
      ];
      await collection
        .aggregate([
          ...(query?.latitude && query?.longitude ? geoNear : []),
          ...(query?.userId ? match : []),
        ])
        .toArray()
        .then((results) => {
          response.status(200).send(query?.userId ? results[0] : results);
        })
        .catch((error) => {
          response.status(500).send(error);
        })
        .finally(() => client.close());
      break;
    case "POST":
      const user = await collection.findOne({
        email: body?.email.toLowerCase(),
      });

      if (!user) {
        await collection
          .insertOne({
            name: body.name,
            email: body.email.toLowerCase(),
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
    case "PATCH":
      await collection
        .updateOne(
          { _id: new ObjectId(session?.user?._id) },
          { $set: { ...body, lastActiveAt: new Date() } }
        )
        .then(() => {
          response.status(200).send("Good things come to those who wait.");
        })
        .catch((error) => {
          response.status(500).send(error);
        })
        .finally(() => client.close());
      break;
    case "DELETE":
      // Delete Profile Picture

      // Delete Likes

      await client
        .db("bessa")
        .collection("likes")
        .deleteMany({ userId: new ObjectId(session?.user?._id) });

      // Delete Posts

      // Delete Media

      // Delete Messages

      await client
        .db("bessa")
        .collection("messages")
        .deleteMany({
          $or: [
            { authorId: new ObjectId(session?.user?._id) },
            { recipientId: new ObjectId(session?.user?._id) },
          ],
        });

      // Delete User

      await collection
        .deleteOne({ _id: new ObjectId(session?.user?._id) })
        .then(async () => {
          await storage
            .bucket("bessa")
            .file(`avatars/${session?.user?._id}`)
            .delete();

          response.status(200).send("Good things come to those who wait.");
        })
        .finally(() => client.close());

      break;
    default:
      response.status(405).send();
  }
}
