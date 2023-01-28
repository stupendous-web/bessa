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
      await storage
        .bucket("bessa")
        .upload(file?.filepath, {
          destination: `avatars/${session?.user?._id}`,
          contentType: file?.mimetype,
        })
        .finally(() => {
          response.status(200).send("Good things come to those who wait.");
        });
      break;
    default:
      response.status(405).send();
  }
}
