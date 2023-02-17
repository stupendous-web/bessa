import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { html, plainText } from "@/utils/emailTemplate";
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
          { $match: { "settings.emailNotifications": "daily" } },
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
              as: "notifications",
              pipeline: [{ $match: { isRead: false } }],
            },
          },
        ])
        .toArray()
        .then(async (results) => {
          await results
            ?.filter(
              (result) =>
                result?.messages?.length || result?.notifications?.length
            )
            ?.map((result) => {
              transporter.sendMail({
                from: "hello@bessssssa.com",
                to: result?.email,
                subject: "Somebody Likes You!",
                text: plainText(
                  result?.name,
                  "Somebody Likes You!",
                  "You have unread notifications on Bessa."
                ),
                html: html(
                  result?.name,
                  "Somebody Likes You!",
                  "You have unread notifications on Bessa.",
                  "https://bessssssa.com/app/messages",
                  "OPEN"
                ),
              });
            });

          response.send(
            `${
              results?.filter(
                (result) =>
                  result?.messages?.length || result?.notifications?.length
              )?.length
            } emails sent!`
          );
        })
        .finally(() => client.close());
      break;
    default:
      response.status(405).send();
  }
}
