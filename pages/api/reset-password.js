import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(request, response) {
  const body = request?.body;

  const client = new MongoClient(process.env.MONGO_DB_URI);
  const collection = client.db("bessa").collection("users");
  await client.connect();

  switch (request.method) {
    case "POST":
      const token = uuidv4();

      await collection
        .updateOne({ email: body?.email }, { $set: { token: token } })
        .then(() => {
          let transorter = nodemailer.createTransport({
            service: "SendinBlue",
            auth: {
              user: process.env.SENDINBLUE_USER,
              pass: process.env.SENDINBLUE_PASS,
            },
          });
          let message = {
            from: "topher@stupendousweb.com",
            to: [body?.email],
            subject: "Your password reset",
            text: `Click <a href="https://bessssssa.com/reset-password?email=${body?.email}&token=${token}">here</a> to reset your password`,
          };
          transorter
            .sendMail(message)
            .then(() => response.send("Good things come to those who wait."))
            .catch((error) => {
              console.log(error);
              response.status(500).json(error);
            });
        })
        .catch((error) => {
          response.status(500).json(error);
        })
        .finally(() => client.close());
      break;
    case "PATCH":
      await collection
        .aggregate([
          { $find: { $and: [{ email: body?.email }, { token: body?.token }] } },
        ])
        .toArray()
        .then(async (results) => {
          if (results) {
            await collection.updateOne(
              { email: body?.email },
              { $set: { password: bcrypt.hashSync(body.password, 10) } }
            );

            response.send("Good things come to those who wait.");
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
