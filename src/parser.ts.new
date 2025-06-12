export interface HypAsset {
	type: 'model' | 'avatar' | 'script';
	url: string;
	size: number;
	mime: string;
}

export interface HypBlueprint {
	name: string;
	model?: string;
	script?: string;
	props: { [key: string]: { type: string; url: string } };
	frozen: boolean;
}

export interface HypHeader {
	blueprint: HypBlueprint;
	assets: HypAsset[];
}

export interface ParsedHyp {
	header: HypHeader;
	assets: Map<string, Uint8Array>;
}

export class HypParser {
	static parse(buffer: ArrayBuffer): ParsedHyp {
		try {
			const view = new DataView(buffer);

			// Read header size (first 4 bytes, little-endian)
			const headerSize = view.getUint32(0, true);

			// Sanity check for header size to avoid memory issues
			if (headerSize <= 0 || headerSize > buffer.byteLength - 4) {
				throw new Error(`Invalid header size: ${headerSize}`);
			}

			// Read JSON header
			const headerBytes = new Uint8Array(buffer, 4, headerSize);
			const headerText = new TextDecoder('utf-8').decode(headerBytes);

			// Parse JSON carefully with a size limit
			let header: HypHeader;
			try {
				header = JSON.parse(headerText);
			} catch (e) {
				throw new Error(`Failed to parse header JSON: ${e.message}`);
			}

			// Validate header structure
			if (!header.blueprint || !Array.isArray(header.assets)) {
				throw new Error('Invalid header structure');
			}

			// Read asset data - use iteration instead of recursion
			const assets = new Map<string, Uint8Array>();
			let offset = 4 + headerSize;

			// Process assets in chunks to avoid stack overflow
			for (let i = 0; i < header.assets.length; i++) {
				const asset = header.assets[i];

				// Sanity check for asset size
				if (asset.size <= 0 || asset.size > buffer.byteLength - offset) {
					console.warn(`Skipping asset with invalid size: ${asset.url}`);
					continue;
				}

				// Create a copy of the asset data rather than a view to avoid memory issues
				const assetData = buffer.slice(offset, offset + asset.size);
				assets.set(asset.url, new Uint8Array(assetData));
				offset += asset.size;
			}

			return { header, assets };
		} catch (error) {
			console.error('Error parsing HYP file:', error);
			throw error;
		}
	}

	static serialize(parsed: ParsedHyp): ArrayBuffer {
		try {
			// Validate input
			if (!parsed.header || !parsed.header.blueprint || !Array.isArray(parsed.header.assets)) {
				throw new Error('Invalid HYP structure for serialization');
			}

			// Use a replacer function to prevent circular references
			const headerText = JSON.stringify(parsed.header, (key, value) => {
				if (typeof value === 'object' && value !== null) {
					// Prevent circular references
					const seen = new Set();
					return Object.keys(value).reduce((acc, key) => {
						const val = value[key];
						if (typeof val !== 'object' || val === null || !seen.has(val)) {
							if (typeof val === 'object' && val !== null) {
								seen.add(val);
							}
							acc[key] = val;
						}
						return acc;
					}, {});
				}
				return value;
			});

			const headerBytes = new TextEncoder().encode(headerText);
			const headerSize = headerBytes.length;

			// Calculate total size with validation
			let totalSize = 4 + headerSize; // 4 bytes for header size + header

			// Validate all assets before calculating total size
			for (const asset of parsed.header.assets) {
				if (!asset.url || !asset.size || !parsed.assets.has(asset.url)) {
					console.warn(`Skipping invalid asset during serialization: ${asset.url}`);
					continue;
				}

				const assetData = parsed.assets.get(asset.url);
				// Verify asset size matches the actual data size
				const actualSize = assetData?.length || 0;
				if (actualSize !== asset.size) {
					console.warn(`Correcting asset size mismatch for ${asset.url}: declared ${asset.size}, actual ${actualSize}`);
					asset.size = actualSize;
				}

				totalSize += asset.size;
			}

			const buffer = new ArrayBuffer(totalSize);
			const view = new DataView(buffer);
			const uint8View = new Uint8Array(buffer);

			// Write header size
			view.setUint32(0, headerSize, true);

			// Write header
			uint8View.set(headerBytes, 4);

			// Write assets in chunks to avoid stack issues
			let offset = 4 + headerSize;
			for (let i = 0; i < parsed.header.assets.length; i++) {
				const asset = parsed.header.assets[i];
				const assetData = parsed.assets.get(asset.url);

				if (assetData && assetData.length > 0) {
					// Copy in smaller chunks if needed for very large assets
					const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
					if (assetData.length > CHUNK_SIZE) {
						for (let pos = 0; pos < assetData.length; pos += CHUNK_SIZE) {
							const end = Math.min(pos + CHUNK_SIZE, assetData.length);
							const chunk = assetData.subarray(pos, end);
							uint8View.set(chunk, offset + pos);
						}
					} else {
						uint8View.set(assetData, offset);
					}
					offset += asset.size;
				}
			}

			return buffer;
		} catch (error) {
			console.error('Error serializing HYP file:', error);
			throw error;
		}
	}

	static createBlobUrl(data: Uint8Array, mimeType: string): string {
		const blob = new Blob([data], { type: mimeType });
		return URL.createObjectURL(blob);
	}
} 