const cron = require("node-cron");
const { Logtail } = require("@logtail/node");
const logtail = new Logtail("JjAcqTrRSTsZNb1fCSV9HQsW");

cron.schedule("* * * * * *", function () {
  logtail.info("cron triggered");
  console.log("running a task every minute");
});
