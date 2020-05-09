const dirTree = require("directory-tree");
const YAML = require('yaml');
const fs = require('fs');

const json = {
  version: '0.1.0'
};

const fixMetadata = function(path) {
  console.log('Fixing deck', path);
  const yaml = fs.readFileSync(path, 'utf8');
  const _metadata = YAML.parse(yaml);
  const metadata = {
    code: _metadata.abbr || _metadata.code.toLowerCase(),
    name: _metadata.name,
    official: _metadata.official
  }
  if (_metadata.official) {
    metadata.author = 'Cards Against Humanity';
    metadata.url = 'https://www.cardsagainsthumanity.com/'
  } else {
    if (_metadata.author) {
      metadata.author = _metadata.author;
    }
    if (_metadata.url) {
      metadata.url = _metadata.url;
    }
  }

  fs.writeFileSync(path, YAML.stringify(metadata), 'utf8');
}

dirTree("./src", { extensions: /\.yaml/ }, (item) => {
  fixMetadata(item.path);
});
