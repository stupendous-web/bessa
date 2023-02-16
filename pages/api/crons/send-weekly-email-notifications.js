import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { template } from "@/utils/emailTemplate";
export default async function handler(request, response) {
  switch (request.method) {
    case "POST":
      const client = new MongoClient(process.env.MONGO_DB_URI);
      const collection = client.db("bessa").collection("users");
      await client.connect();

      let transporter = nodemailer.createTransport({
        service: "SendinBlue",
        auth: {
          user: process.env.SENDINBLUE_USER,
          pass: process.env.SENDINBLUE_PASS,
        },
      });

      let message = {
        from: "hello@bessssssa.com",
        to: "topher@stupendousweb.com",
        subject: "Somebody likes you!",
        text: "You have new notifications on Bessa!",
        html: template("Topher"),
      };

      transporter.send();

      await collection
        .aggregate([{ $match: { "settings.emailNotifications": "weekly" } }])
        .toArray()
        .then((results) => {
          response.json(results);
        })
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
