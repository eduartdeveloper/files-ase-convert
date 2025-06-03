const ase = require('../');
const fs = require('fs');

const buffer = fs.readFileSync('./name_file.ase');
const decoded = simplify(ase.decode(buffer));
fs.writeFileSync('./name_file.json', JSON.stringify(decoded, null, 2), 'utf8');

console.log('✅ Archivo test.json generado correctamente.');

function simplify(data) {
    data.colors.forEach(function(c) {
        c.color = c.color.map(function(n) {
        return Math.round(n * 1000) / 1000;
        });
    });

    return data;
}
