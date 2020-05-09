const dirTree = require("directory-tree");
const fs = require('fs');

const removeDots = function(path) {
  console.log('Removing dots from', path);
  const txt = fs.readFileSync(path, 'utf8');
  const purged = [];
  const regex = /[^.]\.$/;
  txt.split('\n').forEach(function(line) {
    const found = line.match(regex);
    if (found) {
      purged.push(line.substring(0, line.length -1));
    } else {
      purged.push(line);
    }
  });
  // console.log(purged.join('\n'));
  fs.writeFileSync(path, purged.join('\n'), 'utf8');
}

if (process.argv.length === 3) {
  removeDots(process.argv[2]);
} else {
  const filteredTree = dirTree("./src", { extensions: /\.txt/ }, (item) => {
    removeDots(item.path);
  });
}
