const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const outputPath = process.env.OUTPUT_PATH || 'build';

const loadMetadata = function(path) {
  const json = fs.readFileSync(path, 'utf8');
  return JSON.parse(json);
}

const template = `
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <title>Buttons Against Humanity - Decks</title>
  </head>
  <body>
    <div class="container-fluid">
      <h1>Buttons Against Humanity Decks</h1>
      <h4>{{langs}} languages - {{expansions}} decks - {{questions}} questions - {{answers}} answers</h4>
      <div class="row">
      {{#decks}}
        <div class="col-12 col-md-6 col-lg-3 mb-3">
          <div class="btn btn-dark p-4 w-100 h-100">
            <h5>{{name}}</h5>
            <dl class="row mt-3 mb-0">
              <dt class="col-4 text-right">Questions: </dt><dd class="col-8 text-left">{{questions.length}}</dd>     
              <dt class="col-4 text-right">Answers: </dt><dd class="col-8 text-left">{{answers.length}}</dd>
              {{#author}}
                {{#url}}
                  <dt class="col-4 text-right">Author: </dt><dd class="col-8 text-left"><a class="text-light" href="{{{url}}}">{{author}}</a></dd>
                {{/url}}
                {{^url}}
                  <dt class="col-4 text-right">Author: </dt><dd class="col-8 text-left">{{author}}</dd>
                {{/url}}
              {{/author}}
              {{^author}}
                {{#url}}
                  <dt class="col-4 text-right">URL: </dt><dd class="col-8 text-left"><a href="{{{url}}}">{{{url}}}</a></dd>
                {{/url}}
              {{/author}}
              <dt class="col-4 text-right">Download</dt><dd class="col-8 text-left"><a class="text-light" href="./{{lang}}-{{code}}.json">{{code}}</a></dd>
            </dl>
          </div>
        </div>
      {{/decks}}
      </div>
      <div class="my-4 text-center">
        All the content of this repo is available under <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/">Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)</a>
      </div>
    </div>
  </body>
</html>
`;

const decks = loadMetadata(`${outputPath}${path.sep}full.json`);

const data = {
  langs: 0,
  expansions: 0,
  questions: 0,
  answers: 0,
  decks: []
};

const langs = [];
Object.keys(decks.decks).forEach(function(deckcode ) {
  const deck = decks.decks[deckcode];
  data.expansions++;
  if(!langs.includes(deck.lang)) {
    data.langs++;
    langs.push(deck.lang);
  }
  data.questions += deck.questions.length;
  data.answers += deck.answers.length;
  data.decks.push({code, name, lang, author, url} = deck);
});

const rendered = Mustache.render(template, data);

fs.writeFileSync(`${outputPath}${path.sep}index.html`, rendered);
