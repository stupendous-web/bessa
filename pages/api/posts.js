import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
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
      await collection
        .aggregate([
          ...(query?.postId
            ? [{ $match: { _id: new ObjectId(query?.postId) } }]
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
          isNSFW: fields?.isNSFW === "true",
          isPublic: fields?.isPublic === "true",
          ...(!!fields?.flair ? { flair: fields?.flair } : {}),
          userId: new ObjectId(session?.user?._id),
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
    case "DELETE":
      await collection
        .aggregate([
          {
            $match: {
              $and: [
                { _id: new ObjectId(query.postId) },
                { userId: new ObjectId(session?.user?._id) },
              ],
            },
          },
        ])
        .toArray()
        .then(async (results) => {
          if (results) {
            results[0]?.type &&
              (await storage
                .bucket("bessa")
                .file(`posts/${results[0]?._id}`)
                .delete());
            await client
              .db("bessa")
              .collection("likes")
              .deleteMany({ postId: new ObjectId(query.postId) })
              .then(
                async () =>
                  await collection
                    .deleteOne({ _id: new ObjectId(query.postId) })
                    .then(() =>
                      response.send("Good things come to those who wait.")
                    )
                    .finally(() => client.close())
              )
              .finally(() => client.close());
          } else {
            response.status(402).send();
          }
        })
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
