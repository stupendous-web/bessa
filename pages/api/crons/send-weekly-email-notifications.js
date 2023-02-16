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

      await collection
        .aggregate([
          { $match: { "settings.emailNotifications": "weekly" } },
          {
            $lookup: {
              from: "messages",
              localField: "_id",
              foreignField: "recipientId",
              as: "messages",
              pipeline: [{ $match: { isRead: false } }],
            },
          },
          {
            $lookup: {
              from: "notifications",
              localField: "_id",
              foreignField: "recipientId",
              as: "notfications",
              pipeline: [{ $match: { isRead: false } }],
            },
          },
        ])
        .toArray()
        .then((results) => {
          results?.map((result) => {
            if (result?.messages?.length || result?.notifications?.length) {
              transporter.sendMail({
                from: "hello@bessssssa.com",
                to: result?.email,
                subject: "Somebody Likes You!",
                text: "You have unread notifications on Bessa.",
                html: template(
                  result?.name,
                  "Somebody Likes You!",
                  "You have unread notifications on Bessa.",
                  "https://bessssssa.com/app/messages",
                  "OPEN"
                ),
              });
            }
          });
        })
        .finally(() => {
          client.close();
          response.send("Good things come to those who wait.");
        });
      break;
    default:
      response.status(405).send();
  }
}
