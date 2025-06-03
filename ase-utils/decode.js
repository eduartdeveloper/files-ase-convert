const assert = require('assert');
const constants = require('./constants');

const errors = {
    header: 'No es un archivo .ASE válido',
    unexpected: 'Estado inesperado. ¡Esto es un bug!'
};

function decode(buffer) {
    // Si es string, conviértelo en Buffer
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer);
    }

    // Validar cabecera "ASEF"
    assert(getChar8(0) === 'A', errors.header);
    assert(getChar8(1) === 'S', errors.header);
    assert(getChar8(2) === 'E', errors.header);
    assert(getChar8(3) === 'F', errors.header);

    // Leer versión (dos enteros de 16 bits)
    const versionMajor = buffer.readUInt16BE(4);
    const versionMinor = buffer.readUInt16BE(6);

    const output = {
        version: `${versionMajor}.${versionMinor}`,
        groups: [],
        colors: []
    };

    const totalBlocks = buffer.readUInt32BE(8);
    let position = 12;

    let state = constants.STATE_GET_MODE;
    let mode = constants.MODE_COLOR;

    let blockLength = 0;
    let block = null;
    let group = null;

    while (position < buffer.length) {
        switch (state) {
            case constants.STATE_GET_MODE:
                readBlockMode();
                break;
            case constants.STATE_GET_LENGTH:
                readBlockLength();
                break;
            case constants.STATE_GET_NAME:
                readBlockName();
                break;
            case constants.STATE_GET_MODEL:
                readBlockModel();
                break;
            case constants.STATE_GET_COLOR:
                readBlockColor();
                break;
            case constants.STATE_GET_TYPE:
                readBlockType();
                break;
            default:
                throw new Error(errors.unexpected);
        }
    }

    return output;

    // Función: leer tipo de bloque (color, grupo, fin de grupo)
    function readBlockMode() {
        const type = buffer.readUInt16BE(position);

        switch (type) {
            case constants.COLOR_START:
                block = {};
                output.colors.push(block);
                mode = constants.MODE_COLOR;
                break;

            case constants.GROUP_START:
                block = { colors: [] };
                output.groups.push(block);
                group = block;
                mode = constants.MODE_GROUP;
                break;

            case constants.GROUP_END:
                group = null;
                position += 2;
                state = constants.STATE_GET_MODE;
                return;

            default:
                throw new Error(`Tipo de bloque inesperado en byte #${position}`);
        }

        // Si estamos dentro de un grupo, agregar color actual a ese grupo
        if (group && mode === constants.MODE_COLOR) {
            group.colors.push(block);
        }

        position += 2;
        state = constants.STATE_GET_LENGTH;
    }

    // Función: leer longitud del bloque (4 bytes)
    function readBlockLength() {
        blockLength = buffer.readUInt32BE(position);
        position += 4;
        state = constants.STATE_GET_NAME;
    }

    // Función: leer nombre del bloque en UTF-16 (2 bytes por carácter)
    function readBlockName() {
        const nameLength = buffer.readUInt16BE(position);
        let name = '';

        for (let i = 1; i < nameLength; i++) {
            name += getChar16(position + i * 2);
        }

        position += nameLength * 2 + 2; // nombre + terminador nulo
        block.name = name;

        state = (mode === constants.MODE_GROUP)
            ? constants.STATE_GET_MODE
            : constants.STATE_GET_MODEL;
    }

    // Función: leer modelo de color (4 caracteres ASCII)
    function readBlockModel() {
        block.model = (
            getChar8(position) +
            getChar8(position + 1) +
            getChar8(position + 2) +
            getChar8(position + 3)
        ).trim();

        position += 4;
        state = constants.STATE_GET_COLOR;
    }

    // Función: leer valores de color (depende del modelo: RGB, CMYK, etc.)
    function readBlockColor() {
        const model = block.model.toUpperCase();
        const count = constants.COLOR_SIZES[model];

        block.color = [];

        for (let i = 0; i < count; i++) {
            block.color.push(buffer.readFloatBE(position));
            position += 4;
        }

        state = constants.STATE_GET_TYPE;
    }

    // Función: leer tipo de color (2 bytes)
    function readBlockType() {
        const typeCode = buffer.readUInt16BE(position);
        block.type = constants.READ_COLOR_TYPES[typeCode];
        position += 2;
        state = constants.STATE_GET_MODE;
    }

    // Leer carácter ASCII (8 bits)
    function getChar8(index) {
        return String.fromCharCode(buffer.readUInt8(index));
    }

    // Leer carácter UTF-16 (16 bits)
    function getChar16(index) {
        return String.fromCharCode(buffer.readUInt16BE(index));
    }
}

module.exports = decode;
