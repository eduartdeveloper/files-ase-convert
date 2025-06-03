# ASE Converter

This project allows you to **convert JSON color palettes to ASE files** and **decode ASE files back to JSON**. It uses simple command-line prompts to specify input and output filenames.

---

## Folder Structure

- `files/json` — Place your input JSON files here and where output JSON files will be saved.
- `files/ase` — Place your input ASE files here and where output ASE files will be saved.
- `ase-utils/` — Contains the encoding and decoding scripts.

---

## Installation

1. Make sure you have **Node.js** installed (v14+ recommended).

2. Clone this repository or download the project files.

3. Navigate to the project folder in your terminal.

4. Install dependencies (if any):
   ```bash
   npm install

## How to use
Available commands in `package.json` scripts:

    "scripts": {
	    "encodeAse": "node ase-utils/convertJsonToAse.js",
	    "decodeAse": "node ase-utils/convertAseToJson.js
	}

----------

### Encoding JSON to ASE

1.  Put your JSON file inside the folder:
    
    ```bash
    /files/json/
    
2.  Run the encode command:
    
    ```bash
    npm run encodeAse
    
3.  You will be prompted to enter:
    
    -   The name of the JSON file (without `.json` extension)
        
    -   The name of the ASE file to generate (without `.ase` extension)
        
4.  The new ASE file will be created inside:
    
    ```bash
    /files/ase/
    
5.  Example output: 
6. ```bash
	'✅ ASE file generated successfully: /files/ase/yourfile.ase'
	
----------

### Decoding ASE to JSON

1.  Put your ASE file inside the folder:
    
    ```bash
    
    /files/ase/
    
2.  Run the decode command:
    
    ```bash
    
    npm run decodeAse
    
3.  You will be prompted to enter:
    
    -   The name of the ASE file (without `.ase` extension)
        
    -   The name of the JSON file to generate (without `.json` extension)
        
4.  The new JSON file will be created inside:
    
    ```bash
    
    /files/json/
    
5.  Example output:
    
    ```bash
    
    '✅ JSON file generated successfully: /files/json/yourfile.json'
    
  ## Notes

-   Ensure filenames are entered **without extensions** when prompted.
    
-   Files must be placed in their respective folders before running commands.
    
-   Color values are normalized during encoding and rounded during decoding.