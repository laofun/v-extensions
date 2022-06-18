// read plugins file to build
"use strict";
const path = require("path");
const fs = require("fs").promises;
const pLimit = require("p-limit");
var pluginsData  = [];


startBuildPlugins();

async function startBuildPlugins() {
  try {
    const limit = pLimit(1);
    const directoryPath = path.join(__dirname, "plugins");
    var fileNames = await fs.readdir(directoryPath);
    const promises = fileNames.map((file) =>
      limit(() => readAndConvert(directoryPath, file))
    );
    // Only one promise is run at once
    await Promise.all(promises);
   
    console.log(`Done!`, pluginsData);
    var jsonContent = JSON.stringify(pluginsData);
    await writeFile("plugin.json", jsonContent);
  } catch (e) {
    throw e;
    console.log(e);
    return Promise.resolve(false);
  }
}
async function readAndConvert(dir, file) {
  try {
    let rawdata = await fs.readFile(path.join(dir, file), "utf-8");
    let jsonData = JSON.parse(rawdata);
    var data = {
      uuid: jsonData.uuid,
      name: jsonData.name,
      version: jsonData.version,
      url: '',
    }
    pluginsData.push(data);
    // console.log(jsonData.uuid,jsonData.name, jsonData.version);
  } catch (error) {
    console.log("readAndConvert err", error);
  }
}
async function writeFile(fileName, lineData) {
  fs.writeFile(fileName, lineData, 'utf8', function (err) {
    if (err) return console.log(err);
  });
  return true;
}
