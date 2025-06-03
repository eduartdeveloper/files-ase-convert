const ByteBuffer = require('bytebuffer');
const constants = require('./constants');

function encode(data) {
    const colors = data.colors;
    const numberOfSwatches = colors.length;
    const ase = new ByteBuffer();

    // Escribir cabecera del archivo ASE
    ase.writeUTF8String(constants.FILE_SIGNATURE); // Firma "ASEF"
    ase.writeInt(constants.FORMAT_VERSION);        // Versión
    ase.writeInt(numberOfSwatches);                // Cantidad de bloques de color

    // Procesar cada color
    colors.forEach(color => {
        const swatch = new ByteBuffer();

        // Tipo de bloque: Color
        ase.writeShort(constants.COLOR_START);

        // Nombre del color (UTF-16 con terminador)
        writeUTF16StringWithTerminator(swatch, color.name);

        // Modelo de color (rellenar si es menor de 4 caracteres)
        const model = color.model.padEnd(4, ' ');
        swatch.writeUTF8String(model);

        // Valores de color según modelo
        const size = constants.COLOR_SIZES[color.model.toUpperCase()];
        color.color.slice(0, size).forEach(value => swatch.writeFloat(value));

        // Tipo de color: Global / Spot / Normal
        swatch.writeShort(constants.WRITE_COLOR_TYPES[color.type]);

        // Longitud del bloque
        ase.writeInt(swatch.offset);

        // Agregar bloque de color
        swatch.flip();
        ase.append(swatch);
    });

    ase.flip();
    return ase.toBuffer();
}

// Función auxiliar para escribir strings en UTF-16 con terminador
function writeUTF16StringWithTerminator(buffer, str) {
    buffer.writeShort(str.length + 1); // Longitud + terminador
    for (let i = 0; i < str.length; i++) {
        buffer.writeShort(str.charCodeAt(i));
    }
    buffer.writeShort(0); // Terminador (null)
}

module.exports = encode;
