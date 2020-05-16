module.exports.run = async function (subReddit) {
  const fs = require("fs");
  jsonFile = null;
  if (fs.existsSync("data.json")) {
    jsonFile = JSON.parse(fs.readFileSync("data.json"));
  }
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  await page.goto(subReddit, { waitUntil: "networkidle2" });
  let data = await page.evaluate(() => {
    let post = document.querySelector('div[data-subreddit="FreeGameFindings"]');
    let title = post.querySelector(`.title`).textContent;
    let url = post.querySelector(`.thumbnail`).href;
    let thumbnail;
    if (post.querySelector(`.thumbnail > img`)) {
      thumbnail = post.querySelector(`.thumbnail > img`).src;
    }

    return {
      id: post.id,
      url,
      title,
      thumbnail,
    };
  });
  await browser.close();
  let shouldMerge = true;
  let newJson = { items: [data] };
  let titleValid = [
    "steam",
    "ps4",
    "xbox",
    "microsoft store",
    "epic",
    "epic games",
    "epic launcher",
    "epicgames",
    "epic game store",
    "rockstar",
    "rockstar launcher",
    "gog",
    "origin",
    "social club",
    "uplay",
  ];
  let urlValid = ["bethesda", "blizzard"];
  let valid = false;

  for (let i = 0; i < titleValid.length; i++) {
    if (data.title.toLowerCase().includes(titleValid[i]) === true) {
      valid = true;
      break;
    }
  }

  if (valid === false) {
    for (let i = 0; i < urlValid.length; i++) {
      if (data.url.toLowerCase().includes(urlValid[i]) === true) {
        valid = true;
        break;
      }
    }
  }

  if (jsonFile !== null && valid === true) {
    for (let i = 0; i < jsonFile.items.length; i++) {
      if (jsonFile.items[i].url === data.url) {
        shouldMerge = false;
        break;
      }
    }
    if (jsonFile.items.length > 7) jsonFile.items.pop();

    if (shouldMerge === true) {
      newJson = { items: [data].concat(jsonFile.items) };
    }
  }

  if (shouldMerge === true && valid === true) {
    fs.writeFileSync("data.json", JSON.stringify(newJson));
    return data;
  }

  return null;
};
