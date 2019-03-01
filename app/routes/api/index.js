async function getUser() {
  try {
    const response = await axios.get("/user?ID=12345");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
try {
  const server = require("../../lib/server");
  const axios = require("axios");
  const cheerio = require("cheerio");

  server.get("/api/me", async (req, res) => {
    const response = await axios.get("https://github.com/");
    const $ = await cheerio.load(response.data);
    console.log($("h1").text());
    const data = $("h1").text();

    await res.json({ data });
  });

  server.get("/api/version", (req, res) => {
    res.json({
      version: 1.0
    });
  });

  module.exports = server;
} catch (err) {
  console.error("API Error", err);
}
