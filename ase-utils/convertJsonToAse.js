const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ase = require('../index');

// Crear interfaz para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Preguntar por el nombre del archivo JSON
rl.question("📄 Enter the JSON file name (without extension): ", (jsonFileName) => {
    const jsonPath = path.join(__dirname, '../files/json', `${jsonFileName}.json`);

    // Verificar si el archivo existe
    if (!fs.existsSync(jsonPath)) {
        console.error(`❌ The file "${jsonFileName}.json" does not exist in /files/json`);
        rl.close();
        return;
    }

    rl.question("📝 Enter the output ASE file name (without extension): ", (aseFileName) => {
        const asePath = path.join(__dirname, '../files/ase', `${aseFileName}.ase`);

        // Leer y convertir el archivo JSON
        const input = require(jsonPath);

        const convertedInput = {
            ...input,
            colors: input.colors.map(color => ({
                ...color,
                color: color.color.map(c => Math.round((c / 255) * 1000) / 1000),
            }))
        };

        // Codificar a formato ASE
        const encodedBuffer = ase.encode(convertedInput);

        // Escribir archivo ASE en la carpeta correspondiente
        fs.writeFileSync(asePath, encodedBuffer);

        console.log(`✅ ASE file generated successfully: ${asePath}`);
        rl.close();
    });
});
