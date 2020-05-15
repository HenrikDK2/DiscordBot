module.exports.run = async function (subReddit) {
  const fs = require("fs");
  jsonFile = null;
  if (fs.existsSync("data.json")) {
    jsonFile = JSON.parse(fs.readFileSync("data.json"));
  }
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
  if (jsonFile === null || jsonFile.id !== data.id) {
    fs.writeFileSync("data.json", JSON.stringify(data));
    return data;
  } else return null;
};
