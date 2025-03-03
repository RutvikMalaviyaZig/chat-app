const cron = require("node-cron");
const { sendMessageToAll } = require("../controllers/messageSendAll");

// Schedule the job to run at 8 AM daily
cron.schedule("0 8 * * *", () => {
  console.log("Sending scheduled message...");
  let msg = "Good morning..!";
  sendMessageToAll(msg);
}, {
  timezone: "UTC",
});
console.log("Cron job scheduled: Sending messages at 8 AM UTC daily.");


// const cron = require("cron");

// const job = CronJob.from({
// 	cronTime: '0 8 * * *',
// 	onTick: sendMessageToAll("Good morning..!"),
// 	start: true,
// 	timeZone: 'UTC'
// });