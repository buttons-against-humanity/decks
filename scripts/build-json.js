const dirTree = require("directory-tree");
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const outputPath = process.env.OUTPUT_PATH || 'build';

const json = {
  version: 2,
  decks: {}
};

const parseMetadata = function(path) {
  const yaml = fs.readFileSync(path, 'utf8');
  return YAML.parse(yaml);
}

const parseTxt = function(path) {
  try {
    const txt = fs.readFileSync(path, 'utf8');
    return txt.split('\n').filter(line => !!line);
  } catch (e) {
    return [];
  }
}

const parseDeck = function(metadataYaml) {
  const _path = metadataYaml.replace(`${path.sep}metadata.yaml`, '');
  const [ _, lang ] = _path.split(path.sep);
  const metadata = parseMetadata(metadataYaml);
  metadata.code = slugify(metadata.code);
  const questions = parseTxt(`${_path}${path.sep}questions.txt`);
  const answers = parseTxt(`${_path}${path.sep}answers.txt`);
  const deckCode = `${lang}-${metadata.code}`;
  const data = Object.assign(metadata, { lang },{ questions }, { answers });
  json.decks[deckCode] = data;
  writeToFile(deckCode, data);
}

const writeToFile = function(fileName, data) {
  fs.writeFileSync(`${outputPath}${path.sep}${fileName}.json`, JSON.stringify(data, null ,1), 'utf8')
}

const metadatas = [];

dirTree("./src", { extensions: /\.yaml/ }, (item) => {
  metadatas.push(item.path);
});

if (fs.existsSync(outputPath)) {
  const stat = fs.statSync(outputPath);
  if (!stat.isDirectory()) {
    console.error('outputPath exists and is not a directory', outputPath);
    process.exit(1);
  }
} else {
  fs.mkdirSync(outputPath, { recursive: true });
}

for (let i=0;i<metadatas.length;i++) {
  parseDeck(metadatas[i]);
}

writeToFile('full', json);

