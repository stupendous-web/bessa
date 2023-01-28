import { MongoClient } from "mongodb";
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
      request.file = files?.file;
      resolve();
    });
  });

  const file = request?.file;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("avatars");
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
    case "POST":
      await collection
        .updateOne(
          { userId: session?.user?._id },
          { $set: { userId: session?.user?._id } },
          { upsert: true }
        )
        .then(async (result) => {
          await storage.bucket("bessa").upload(file?.filepath, {
            destination: `avatars/${result.insertedId}`,
            contentType: file?.mimetype,
          });
        })
        .then((result) => response.status(200).json(result.insertedId))
        .finally(() => {
          client.close();
        });
      break;
    default:
      response.status(405).send();
  }
}
