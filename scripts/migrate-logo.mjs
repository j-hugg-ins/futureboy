import https from "https";
import fs from "fs";
import path from "path";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks),
          }),
        );
      })
      .on("error", reject);
  });
}

const html = (await get("https://futureboy.uk/")).body.toString("utf8");

const urls = new Set();
for (const m of html.matchAll(/https:\/\/[^"'\s>]+\.(?:svg|png|webp|jpg)/gi)) {
  urls.add(m[0].replace(/&amp;/g, "&"));
}
for (const m of html.matchAll(/\/\/cdn\.shopify\.com[^"'\s>]+\.(?:svg|png|webp|jpg)/gi)) {
  urls.add("https:" + m[0].replace(/&amp;/g, "&"));
}
for (const m of html.matchAll(
  /(?:src|href|content)=["']([^"']+\.(?:svg|png|webp|jpg)(?:\?[^"']*)?)["']/gi,
)) {
  let u = m[1].replace(/&amp;/g, "&");
  if (u.startsWith("//")) u = "https:" + u;
  if (u.startsWith("/")) u = "https://futureboy.uk" + u;
  urls.add(u.split("?")[0]);
}

const candidates = [...urls].filter(
  (u) => /logo|futureboy|icon|brand|header/i.test(u) || u.includes("/files/"),
);

console.log("Candidates:");
for (const u of candidates.slice(0, 40)) console.log(u);

fs.mkdirSync("public/brand", { recursive: true });

// Prefer svg logo if present
const logoUrl =
  candidates.find((u) => /logo/i.test(u) && u.endsWith(".svg")) ||
  candidates.find((u) => /logo/i.test(u)) ||
  candidates.find((u) => /futureboy/i.test(u) && /\.(png|svg|webp)$/i.test(u));

if (!logoUrl) {
  console.error("No logo candidate found — check candidates above");
  process.exit(1);
}

const clean = logoUrl.split("?")[0];
const ext = path.extname(new URL(clean).pathname) || ".png";
const dest = path.join("public", "brand", "logo" + ext);
const res = await get(clean);
fs.writeFileSync(dest, res.body);
console.log("Saved", dest, "from", clean, "bytes", res.body.length);

// Also try common Shopify logo path from og:image or apple-touch
const og = html.match(/property="og:image"\s+content="([^"]+)"/i);
if (og) {
  console.log("og:image", og[1]);
}
