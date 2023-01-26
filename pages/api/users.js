import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(request, response) {
  const body = request.body;
  const query = request.query;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "GET":
      if (query._id) {
        await collection
          .findOne({ _id: ObjectId(query._id) })
          .then((results) => {
            delete results.password;
            response.status(200).send(results);
          })
          .catch((error) => {
            response.status(500).send(error);
          })
          .finally(() => client.close());
      } else {
        await collection
          .aggregate(
            query?.latitude && query?.longitude
              ? [
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
                ]
              : []
          )
          .toArray()
          .then((results) => {
            response.status(200).send(results);
          })
          .catch((error) => {
            response.status(500).send(error);
          })
          .finally(() => client.close());
      }
      break;
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
    case "PATCH":
      await collection
        .updateOne(
          { _id: ObjectId(session?.user?._id) },
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
    default:
      response.status(405).send();
  }
}
