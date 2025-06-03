const ase = require('../');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Pedir nombre del archivo .ase
rl.question('Enter the name of the ASE file (without extension): ', (aseFileName) => {
    const asePath = path.join(__dirname, '../files/ase', `${aseFileName}.ase`);

    // Verificar si existe
    if (!fs.existsSync(asePath)) {
        console.error(`❌ The file "${aseFileName}.ase" does not exist in /files/ase`);
        rl.close();
        return;
    }

    // Pedir nombre del archivo JSON
    rl.question('Enter the name of the JSON file to generate (without extension): ', (jsonFileName) => {
        const buffer = fs.readFileSync(asePath);
        const decoded = simplify(ase.decode(buffer));

        const jsonPath = path.join(__dirname, '../files/json', `${jsonFileName}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(decoded, null, 2), 'utf8');

        console.log(`✅ JSON file generated successfully: ${jsonPath}`);
        rl.close();
    });
});

// Redondear colores
function simplify(data) {
    data.colors.forEach((c) => {
        c.color = c.color.map((n) => Math.round(n * 1000) / 1000);
    });
    return data;
}
