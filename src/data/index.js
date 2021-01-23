const { a } = require('aws-amplify');
const fs = require('fs');
// const entries = require('./entries.json');

// const words = require('./images.json');
// const images = require('./images_f.json');

// const newObj = [];

// for(const [key, entry] of Object.entries(entries)) {
//     for(const [i, def] of entry.definitions.entries()) {
//         const entry_id = i ? `${key}_${i}` : key;
//         newObj.push({
//             entry_id,
//             entry: entry.entry,
//             gramm: entry.gramm,
//             definition: def.definition,
//             examples: def.examples,
//             audios: entry.audios
//         })
//     }
// }

// fs.writeFileSync('./entries-aws.json', JSON.stringify(newObj, null, 2));

// const txt = fs.readFileSync('./img.txt').toString().split('\r\n').filter(t => /^(\w|\W)+(|\s)\(\w(|\W)+\)/.test(t));
// console.log(txt)

// const arr = fs.readFileSync('./imgf.txt').toString().split('\r\n');

// console.log(arr.length);

// const arr_i = arr.map(w => ({name: w, number: parseInt(w.replace(/\D+/g, ''))}));

// arr_i.sort((a, b) => a.number > b.number ? 1 : a.number < b.number ? -1 : 0)

// console.log(arr_i.map(img => img.name));

// const txt = arr_i.map(img => img.name)


// const txt = words.map((w, i) => ({word: w.replace(' (S)', '').trim(), image: images[i]}));

// console.log(txt);

// fs.writeFileSync('./image_map.json', JSON.stringify(txt, null, 2));

const map = require('./image_map.json');
const entries = require('./entries-aws.json');

// const html = fs.readFileSync('./index.html').toString();

// const mapToHtml = map.map(img => (`<div><h3>${img.word}<h3><img src="http://localhost:8000/${img.image}" />${img.image}</div>`)).join('\n');

// fs.writeFileSync('./index.html', html + mapToHtml + '\n</body>\n</html>');

for (const [i, entry] of entries.entries()) {
    for (const img of map) {
        if (img.word === entry.entry) {
            entries[i].images = [img.image];
        }
    }
};

fs.writeFileSync('./entries-aws.json', JSON.stringify(entries, null, 2));