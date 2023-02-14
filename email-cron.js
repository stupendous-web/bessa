const cron = require('node-cron');
const { Node: Logtail } = require("@logtail/js");
const logtail = new Logtail("JjAcqTrRSTsZNb1fCSV9HQsW");

cron.schedule('* * * * *', function() {
    console.log('running a task every minute');
    logtail.info("Log message with structured data.", {
        item: "Orange Soda",
        price: 100.00
    });
    logtail.flush()
});
