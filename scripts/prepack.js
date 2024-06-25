const fs = require('fs');

const bundle = fs.readFileSync('./build/index.html', 'utf8');

const escaped = JSON.stringify(bundle);
const js = `export default ${escaped}`;

fs.writeFileSync('./src/dist/bundle.js', js);
