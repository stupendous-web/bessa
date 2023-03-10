import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
const { Storage } = require("@google-cloud/storage");

export default async function handler(request, response) {
  const body = request.body;
  const query = request.query;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  const req = request;
  const res = response;
  const session = await getServerSession(req, res, authOptions);

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
      const onlineSort = [{ $sort: { lastActiveAt: -1 } }];
      const newSort = [{ $sort: { createdAt: -1 } }];
      const match = [
        {
          $match: {
            _id: new ObjectId(query.userId),
          },
        },
      ];
      await collection
        .aggregate([
          ...(query?.sort === "distance" ? geoNear : []),
          ...(query?.sort === "online" ? onlineSort : []),
          ...(query?.sort === "new" ? newSort : []),
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
            settings: { emailNotifications: "weekly" },
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
          { _id: new ObjectId(body?.userId) },
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
      await client
        .db("bessa")
        .collection("likes")
        .deleteMany({ userId: new ObjectId(session?.user?._id) });

      await client
        .db("bessa")
        .collection("comments")
        .deleteMany({ userId: new ObjectId(session?.user?._id) });

      await client
        .db("bessa")
        .collection("notifications")
        .deleteMany({
          authorId: new ObjectId(session?.user?._id),
          recipientId: new ObjectId(session?.user?._id),
        });

      await client
        .db("bessa")
        .collection("posts")
        .deleteMany({
          userId: new ObjectId(session?.user?._id),
        });

      // TODO: Delete Media

      await client
        .db("bessa")
        .collection("messages")
        .deleteMany({
          $or: [
            { authorId: new ObjectId(session?.user?._id) },
            { recipientId: new ObjectId(session?.user?._id) },
          ],
        });

      // TODO: Delete Following ID's

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
