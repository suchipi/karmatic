import fs from "fs";
import path from "path";
import findUp from "find-up";

export function moduleDir(name) {
  const mainFile = require.resolve(name);
  const pkgJson = findUp.sync("package.json", { cwd: path.dirname(mainFile) });
  return path.dirname(pkgJson);
}

export function fileExists(file) {
  try {
    return fs.statSync(file).isFile();
  } catch (e) {}
  return false;
}

export function readFile(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (e) {}
}

export function readDir(file) {
  try {
    return fs.readdirSync(file);
  } catch (e) {}
}

export function tryRequire(file) {
  if (fileExists(file)) return require(file);
}

export function dedupe(value, index, arr) {
  return arr.indexOf(value) === index;
}
