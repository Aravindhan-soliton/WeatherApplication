const fs = require("fs");
const http = require("http");
const path = require("path");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone.js");

let cityDTN;
let city;
let allTimeZone;

const PORT = 8000;

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./");

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith("/")) paths.push("index.html");
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + "/404.html";
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

http
  .createServer(async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
    if (req.url === "/all-timezone-cities") {
      res.writeHead(200, { "Content-Type": "text/json" });
      let data = allTimeZones();
      data = JSON.stringify(data);
      allTimeZone = data.json;
      res.write(data);
      res.end();
    }
    if (req.url.split("=")[0] === "/?city") {
      city = req.url.split("=")[1];
      res.writeHead(200, { "Content-Type": "text/json" });
      let data = timeForOneCity(city);
      cityDTN = data;
      res.write(JSON.stringify(cityDTN));
      res.end();
    }
    if (req.url === "/hourly-forecast") {
      res.writeHead(200, { "Content-Type": "text/json" });
      let lastForeCast = allTimeZones();
      let data = nextNhoursWeather(cityDTN.city_Date_Time_Name, "6", lastForeCast);
      data = JSON.stringify(data);
      res.write(data);
      res.end();
    }
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
