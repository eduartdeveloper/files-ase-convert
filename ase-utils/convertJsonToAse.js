const ase = require('../');
const fs = require('fs');

const input = require('../name_file.json'); // file JSON

const convertedInput = {
    ...input,
    colors: input.colors.map(color => ({
        ...color,
        color: color.color.map(c => Math.round((c / 255) * 1000) / 1000),
    }))
};

const encodedBuffer = ase.encode(convertedInput);
fs.writeFileSync('./name_file.ase', encodedBuffer);

console.log('✅ Archivo Coral Leque de Cores.ase generado correctamente.');
