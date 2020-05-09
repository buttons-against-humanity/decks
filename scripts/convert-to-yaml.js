const dirTree = require("directory-tree");
const yaml = require('yaml');
const fs = require('fs');

const convert = function(path) {
  const dest = path.replace('.json','.yaml');
  const json = fs.readFileSync(path, 'utf8');
  fs.writeFileSync(dest, yaml.stringify(JSON.parse(json)), 'utf8'); 
  console.log('%s -> %s', path, dest);
}

const filteredTree = dirTree("./src", { extensions: /\.json/ }, (item, PATH, stats) => {
  convert(item.path);
}); 

