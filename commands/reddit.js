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
      "—disable-dev-shm-usage",
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
  if (jsonFile === null || data.url !== jsonFile.url) {
    if (jsonFile !== null)
      console.log("data: " + data.url + "  jsonFile: " + jsonFile.url);
    fs.writeFileSync("data.json", JSON.stringify(data));
    return data;
  }
  return null;
};
