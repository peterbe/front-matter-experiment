const fs = require("fs");
const path = require("path");

const fm = require("front-matter");
const yaml = require("js-yaml");

function f1() {
  const m = new Map();
  for (const [folder, files] of walker("content-split")) {
    if (files.includes("index.yaml")) {
      const metadata = yaml.load(
        fs.readFileSync(path.join(folder, "index.yaml"))
      );
      m.set(metadata.slug, folder);
    }
  }
  // console.log(m.size);
}

function f2() {
  const m = new Map();
  for (const [folder, files] of walker("content-combined")) {
    if (files.includes("index.html")) {
      const metadata = fm(
        fs.readFileSync(path.join(folder, "index.html"), "utf8")
      ).attributes;
      m.set(metadata.slug, folder);
    }
  }
  // console.log(m.size);
}

function f3() {
  const m = new Map();
  for (const [folder, files] of walker("content-combined")) {
    if (files.includes("index.html")) {
      const metadata = fm(
        fs.readFileSync(path.join(folder, "index.html"), "utf8")
      ).attributes;
      m.set(metadata.slug, folder);
    }
  }
  // console.log(m.size);
}

function f1b() {
  const m = new Map();
  for (const [folder, files] of walker("content-split")) {
    if (files.includes("index.yaml")) {
      const metadata = yaml.load(
        fs.readFileSync(path.join(folder, "index.yaml"))
      );
      const bodySize = fs.readFileSync(path.join(folder, "index.html")).length;
      m.set(metadata.slug, bodySize);
    }
  }
  // console.log(m.size);
}

function f2b() {
  const m = new Map();
  for (const [folder, files] of walker("content-combined")) {
    if (files.includes("index.html")) {
      const payload = fs.readFileSync(path.join(folder, "index.html"), "utf8");
      const data = fm(payload);
      const metadata = data.attributes;
      const bodySize = data.body.length;
      m.set(metadata.slug, bodySize);
    }
  }
  // console.log(m.size);
}

function* walker(root, depth = 0) {
  const files = fs.readdirSync(root);
  if (!depth) {
    yield [
      root,
      files.filter((name) => {
        return !fs.statSync(path.join(root, name)).isDirectory();
      }),
    ];
  }
  for (const name of files) {
    const filepath = path.join(root, name);
    const isDirectory = fs.statSync(filepath).isDirectory();
    if (isDirectory) {
      yield [
        filepath,
        fs.readdirSync(filepath).filter((name) => {
          return !fs.statSync(path.join(filepath, name)).isDirectory();
        }),
      ];
      // Now go deeper
      yield* walker(filepath, depth + 1);
    }
  }
}

const functions = [f1, f2];
// const functions = [f1b, f2b];

compareFunctions(functions, (iterations = 16));

function compareFunctions(functions) {
  function fmt(ms) {
    return `${(ms / 1000).toFixed(3)}s`;
  }

  const times = Object.fromEntries(functions.map((f) => [f.name, []]));
  for (const i of [...Array(iterations).keys()]) {
    func = functions[i % functions.length];
    const t0 = new Date();
    func();
    const t1 = new Date();
    console.log(i + 1, func.name, fmt(t1 - t0));
    times[func.name].push(t1 - t0);
  }
  console.log("");

  const avgs = [];
  for (const f of Object.keys(times).sort()) {
    const nums = times[f];
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    avgs.push([f, avg]);
  }
  avgs.sort((a, b) => a[1] - b[1]);
  const fastest = avgs[0][1];
  // sort by name again
  avgs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  for (const [f, avg] of avgs) {
    let p;
    if (avg === fastest) {
      p = "fastest";
    } else {
      p = `${((100 * avg) / fastest - 100).toFixed(1)}% slower`;
    }
    console.log(f, fmt(avg), " ", p);
  }
}
