import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import formidable from "formidable";
const { Storage } = require("@google-cloud/storage");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  const form = formidable();
  await new Promise((resolve, reject) => {
    form.parse(request, (error, fields, files) => {
      if (error) {
        reject(error);

        return;
      }
      request.fields = fields;
      request.file = files?.file;
      resolve();
    });
  });

  const fields = request?.fields;
  const file = request?.file;

  const body = request.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("posts");
  await client.connect();

  const req = request;
  const res = response;
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (request.method) {
    case "GET":
      await collection
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
              pipeline: [{ $project: { _id: 1, name: 1 } }],
            },
          },
        ])
        .toArray()
        .then((results) => response.status(200).send(results))
        .finally(() => {
          client.close();
        });
      break;
    case "POST":
      await collection
        .insertOne({
          userId: ObjectId(session?.user?._id),
          createdAt: new Date(),
          ...fields,
        })
        .finally(() => {
          client.close();

          response.status(200).send("Good things come to those who wait.");
        });
      break;
    default:
      response.status(405).send();
  }
}
