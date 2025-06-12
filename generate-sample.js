const fs = require('fs');

// Create sample script content
const scriptContent = `
export default function script(app) {
  app.onUpdate(() => {
    console.log('Sample script running');
  });
}
`;

// Create minimal GLB content (just header)
const glbHeader = Buffer.alloc(12);
glbHeader.writeUInt32LE(0x46546C67, 0); // "glTF" magic
glbHeader.writeUInt32LE(2, 4); // version
glbHeader.writeUInt32LE(12, 8); // total length

const scriptBytes = Buffer.from(scriptContent, 'utf8');

// Create the HYP structure
const header = {
	blueprint: {
		name: "Sample HYP Object",
		model: "model.glb",
		script: "script.js",
		props: {
			color: { type: "color", url: "#ff0000" },
			scale: { type: "number", url: "1.0" }
		},
		frozen: false
	},
	assets: [
		{
			type: "model",
			url: "model.glb",
			size: glbHeader.length,
			mime: "model/gltf-binary"
		},
		{
			type: "script",
			url: "script.js",
			size: scriptBytes.length,
			mime: "text/javascript"
		}
	]
};

// Serialize the HYP file
const headerJson = JSON.stringify(header);
const headerBytes = Buffer.from(headerJson, 'utf8');
const headerSize = headerBytes.length;

// Calculate total size
const totalSize = 4 + headerSize + glbHeader.length + scriptBytes.length;

// Create final buffer
const hypBuffer = Buffer.alloc(totalSize);
let offset = 0;

// Write header size (little-endian)
hypBuffer.writeUInt32LE(headerSize, offset);
offset += 4;

// Write header JSON
headerBytes.copy(hypBuffer, offset);
offset += headerSize;

// Write model data
glbHeader.copy(hypBuffer, offset);
offset += glbHeader.length;

// Write script data
scriptBytes.copy(hypBuffer, offset);

// Save the file
fs.writeFileSync('sample.hyp', hypBuffer);
console.log('Generated sample.hyp file');
console.log(`File size: ${hypBuffer.length} bytes`);
console.log(`Header size: ${headerSize} bytes`);
console.log(`Assets: ${header.assets.length}`); 