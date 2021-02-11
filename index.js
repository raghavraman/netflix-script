var fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'id', title: 'Id'},
      {id: 'name', title: 'Name'},
      {id: 'description', title: 'Description'},
      {id: 'year', title: 'Year'},
      {id: 'type', title: 'Type'},
      {id: 'genre', title: 'Genre'}
    ],
    append: true
  });
const fetch = require("node-fetch");
const jsdom = require("jsdom");


args = process.argv.slice(2);
args.forEach(element => callNetflix(element));

function callNetflix(id) {
    fetch("https://www.netflix.com/title/"+id, {
        "method": "GET",
    })
    .then(res => res.text())
    .then(text => new jsdom.JSDOM(text))
    .then(dom => {
        const content = dom.window.document.querySelector('script[type="application/ld+json"]').innerHTML;
        const json = JSON.parse(content);
        // console.log(json)
        let data = {};
        data.id = id;
        data.name = json.name;
        data.description = json.description;
        data.year = json.dateCreated.substr(0,4);
        data.genre = json.genre;
        data.type = json['@type'];
        csvWriter.writeRecords([data])
    })
    .catch(err => console.error(err));
}