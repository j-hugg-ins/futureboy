import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        },
        (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => {
            try {
              resolve(JSON.parse(d));
            } catch (e) {
              reject(e);
            }
          });
        },
      )
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve, reject);
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
      })
      .on("error", (e) => {
        fs.unlink(dest, () => {});
        reject(e);
      });
  });
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SUBTITLES = {
  "murphy-trucker-cap": "Pine Green & Yellow",
  "shermer-trucker-cap": "Red & Gold",
  "striker-trucker-cap": "Indigo Denim",
  "tyrell-trucker-cap": "Grey Corduroy",
  "miyagi-trucker-cap": "Black & Orange",
  "trucker-hat-burgundy": "Burgundy & Gold",
  "trucker-hat-navy": "Navy & Gold",
  "trucker-hat": "Black & Gold",
};

const DISPLAY_TITLES = {
  "trucker-hat-burgundy": "Porkchop Trucker Cap — Burgundy",
  "trucker-hat-navy": "Porkchop Trucker Cap — Navy",
  "trucker-hat": "Porkchop Trucker Cap — Black",
};

const ACCORDIONS = [
  {
    id: "curving",
    title: "Curving the Peak",
    body: "All my hats ship with a flat visor or peak to give you the option to either keep it that way or curve it if you prefer. If like me you prefer your hats with a curved visor it's best to hold it over a steaming kettle or pan for 10-15 seconds before holding the visor in the curved position. If you just bend it without heat you risk cracking the plastic insert.",
  },
  {
    id: "specs",
    title: "Style Specs",
    body: "Profile: Mid\nConstruction: 5-Panel\nClosure: Snapback",
  },
  {
    id: "measurements",
    title: "Measurements",
    body: "Min: 50 cm\nMax: 62 cm\nHeight: 8.5 cm\nWidth: 17 cm",
  },
  {
    id: "designed",
    title: "Designed by J.",
    body: "I design all Futureboy hats from scratch. Every measurement and material choice is agonised over to an embarrassing degree, all in an attempt at getting close to what I believe is the perfect cap.",
  },
  {
    id: "made",
    title: "Made in China",
    body: "China? I thought you said these were premium hats? Doesn't that mean they need to be made in the US or somewhere even cooler, like Japan? Yeah I'll be honest I was really expecting, and kinda hoping to see 'Made in Japan' here.\n\nI get it. I spent almost a year sourcing hats from factories all over the world. In the US, Europe and yes, also in Japan. Hell even I wanted it to say Made in Japan here. I didn't expect a small independent factory in China to turn out the best cap I've ever worn. But here we are.",
  },
];

const data = await fetchJson("https://futureboy.uk/products.json");
const products = [];

for (const p of data.products) {
  const dir = path.join("public", "products", p.handle);
  fs.mkdirSync(dir, { recursive: true });
  const images = [];
  for (let i = 0; i < p.images.length; i++) {
    const src = p.images[i].src.split("?")[0];
    const ext = path.extname(new URL(src).pathname) || ".jpg";
    const filename = String(i + 1).padStart(2, "0") + ext;
    const dest = path.join(dir, filename);
    console.log("DL", p.handle + "/" + filename);
    await download(src, dest);
    images.push("/products/" + p.handle + "/" + filename);
  }
  const v = p.variants[0];
  products.push({
    id: String(p.id),
    handle: p.handle,
    title: DISPLAY_TITLES[p.handle] || p.title,
    subtitle: SUBTITLES[p.handle] || "",
    sku: v.sku,
    pricePence: 4500,
    available: !!v.available,
    description: stripHtml(p.body_html),
    descriptionHtml: p.body_html,
    accordions: ACCORDIONS,
    images,
  });
}

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/products.json", JSON.stringify(products, null, 2));
console.log("Wrote", products.length, "products");
