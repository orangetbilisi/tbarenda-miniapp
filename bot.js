const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.on("channel_post", async (msg) => {

  let posts = [];

  try {
    posts = JSON.parse(fs.readFileSync("data.json", "utf8"));
  } catch (e) {
    posts = [];
  }

  const text = msg.caption  msg.text  "";

  let image = "";

  if (msg.photo && msg.photo.length) {

    try {

      const file = await bot.getFile(
        msg.photo[msg.photo.length - 1].file_id
      );

      image =
        "https://api.telegram.org/file/bot" +
        process.env.BOT_TOKEN +
        "/" +
        file.file_path;

    } catch (e) {

      image = "";

    }

  }

  const price =
    text.match(/\$\s?\d+/) ||
    text.match(/\d+\$/);

  const rooms =
    text.match(/(\d+)\s*(комнат|ოთახ)/i);

  const area =
    text.match(/(\d+)\s*(м²|კვ)/i);

  const district =
    text.match(/#([A-Za-zА-Яа-я0-9_]+)/);

  posts.unshift({

    id: Date.now(),

    title: text.split("\n")[0],

    price: price ? price[0] : "",

    rooms: rooms ? rooms[1] : "",

    area: area ? area[1] : "",

    district: district ? district[1] : "",

    description: text,

    image: image,

    date: new Date(),

    telegram: msg.link || ""

  });

  posts = posts.slice(0, 100);

  fs.writeFileSync(
    "data.json",
    JSON.stringify(posts, null, 2)
  );

  console.log("NEW POST SAVED");

});

console.log("BOT STARTED");
