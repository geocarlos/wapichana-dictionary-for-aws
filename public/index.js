const fs = require('fs');

const fileContent = fs.readFileSync('./step2.json').toString();

const content = JSON.parse(fileContent);

for(const key in content) {
	const _definitions = content[key].definitions.split('\n');
	content[key].definitions = [];
	for(let i = 0; i < _definitions.length; i++) {
		if (/\d+/.test(_definitions[i][0])) {
			content[key].definitions.push({
				definition: _definitions[i].replace(/\d+\.\s/, ''),
				examples: [
					{
						example: _definitions[i + 1],
						exampleTranslation: _definitions[i + 2]
					}
				]
			})
		} else if (content[key].definitions[content[key].definitions.length - 1] && i > 2) {
			const ex = content[key].definitions[content[key].definitions.length - 1].examples
			console.log(ex)
			if (ex.some(e => e.example.includes(_definitions[i])) || ex.some(e => e.exampleTranslation.includes(_definitions[i]))) {
				console.log(ex)
				continue;
			}
			content[key].definitions[content[key].definitions.length - 1].examples.push({
				example: _definitions[i],
				exampleTranslation: _definitions[i + 1]
			})
		}
	}
}

const step = fileContent.replace('\t', '');

fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));