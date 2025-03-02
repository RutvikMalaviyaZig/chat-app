const cron = require("node-cron");
const { sendMessageToAll } = require("../controllers/messageSendAll");

// Schedule the job to run at 8 AM daily
cron.schedule("0 8 * * *", () => {
  console.log("Sending scheduled message...");
  sendMessageToAll("Good morning..!");
}, {
  timezone: "UTC",
});

console.log("Cron job scheduled: Sending messages at 8 AM UTC daily.");
