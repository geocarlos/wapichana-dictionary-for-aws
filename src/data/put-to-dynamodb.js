const entries = require('./entries-aws.json');
const cp = require('child_process');

const tableName = 'wapichana-dictionary';

const entries_with_leter = entries.map(w => ({
    initialLetter: {S: getInitialLetter(w.entry)},
    entry_id: {S: w.entry_id},
    entry: {S: w.entry},
    gramm: {S: w.gramm},
    definition: {S: w.definition},
    examples: {L: w.examples.map(e => ({M: {example: {S: e.example}, exampleTranslation: {S: e.exampleTranslation}}}))},
    audios: {L: w.audios.map(a => ({S: a}))},
    images: {L: []}
}));

for (const entry of entries_with_leter) {
    const item = JSON.stringify(entry).replace(/"/g, '\\"');
    try {
        cp.execSync(`aws dynamodb put-item --table-name ${tableName} --item "${item}"`, {input: 'inherit'});
        console.log(entry.entry, ' done');
    } catch (error) {
        console.log(entry.entry, ' failed');
    }
}

// try {
//     cp.execSync(`aws-dynamodb put-item --table-name ${tableName} --input-json ${JSON.stringify(entries)}`);
//     console.log('DONE');
// } catch (error) {
//     console.log(error);
// }

function isNotNh(word){
	return word.substring(0, 2).toLowerCase() !== 'nh';
}

function getInitialLetter(entry) {
    return isNotNh(entry) && entry[0].toLocaleLowerCase() !== 'c' ? entry[0].toUpperCase() : entry.toUpperCase().substring(0, 2);
}
