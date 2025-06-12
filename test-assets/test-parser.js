const fs = require('fs');

// Simple parser implementation for testing
function parseHyp(arrayBuffer) {
	const view = new DataView(arrayBuffer);

	// Read header size (first 4 bytes, little-endian)
	const headerSize = view.getUint32(0, true);
	console.log('Header size:', headerSize);

	// Read JSON header
	const headerBytes = new Uint8Array(arrayBuffer, 4, headerSize);
	const headerText = new TextDecoder('utf-8').decode(headerBytes);
	const header = JSON.parse(headerText);

	console.log('Blueprint name:', header.blueprint.name);
	console.log('Assets count:', header.assets.length);

	// Read asset data
	let offset = 4 + headerSize;

	for (const asset of header.assets) {
		console.log(`\nAsset: ${asset.url}`);
		console.log(`  Type: ${asset.type}`);
		console.log(`  Size: ${asset.size} bytes`);
		console.log(`  MIME: ${asset.mime}`);

		const assetData = new Uint8Array(arrayBuffer, offset, asset.size);

		if (asset.type === 'script') {
			const scriptText = new TextDecoder('utf-8').decode(assetData);
			console.log(`  Content preview: ${scriptText.substring(0, 50)}...`);
		}

		offset += asset.size;
	}

	return header;
}

// Test the parser
try {
	const fileData = fs.readFileSync('sample.hyp');
	console.log('Testing HYP parser...');
	console.log('File size:', fileData.length, 'bytes');
	console.log('==================');

	// Convert Buffer to ArrayBuffer properly
	const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.length);
	const parsed = parseHyp(arrayBuffer);

	console.log('\n✅ Parser test successful!');
	console.log('Blueprint structure is valid and assets are accessible');

} catch (error) {
	console.error('❌ Parser test failed:', error);
} 