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
  const query = request.query;

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

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("posts");
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
      await collection
        .aggregate([
          ...(query?.postId
            ? [{ $match: { _id: ObjectId(query?.postId) } }]
            : []),
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
              pipeline: [{ $project: { _id: 1, name: 1 } }],
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "postId",
              as: "likes",
            },
          },
          { $sort: { createdAt: -1 } },
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
          body: fields?.body,
          ...(file?.mimetype && { type: file?.mimetype }),
          nSFW: fields?.nSFW === "true",
          userId: ObjectId(session?.user?._id),
          createdAt: new Date(),
        })
        .then(async (results) => {
          file &&
            (await storage.bucket("bessa").upload(file?.filepath, {
              destination: `posts/${results?.insertedId}`,
              contentType: file?.mimetype,
            }));
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
