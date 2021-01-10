const fs = require('fs');
const entries = require('./entries.json');

const newObj = [];

for(const [key, entry] of Object.entries(entries)) {
    for(const [i, def] of entry.definitions.entries()) {
        const entry_id = i ? `${key}_${i}` : key;
        newObj.push({
            entry_id,
            entry: entry.entry,
            gramm: entry.gramm,
            definition: def.definition,
            examples: def.examples,
            audios: entry.audios
        })
    }
}

fs.writeFileSync('./entries-aws.json', JSON.stringify(newObj, null, 2));