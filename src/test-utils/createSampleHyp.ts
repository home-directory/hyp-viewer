import { HypParser, ParsedHyp } from '../parser';

export function createSampleHyp(): ArrayBuffer {
	// Create sample script content
	const scriptContent = `
export default function script(app) {
  app.onUpdate(() => {
    console.log('Sample script running');
  });
}
`;

	// Create sample model data (minimal GLB header)
	const glbHeader = new ArrayBuffer(12);
	const view = new DataView(glbHeader);
	view.setUint32(0, 0x46546C67, false); // "glTF" magic
	view.setUint32(4, 2, true); // version
	view.setUint32(8, 12, true); // total length

	const scriptBytes = new TextEncoder().encode(scriptContent);

	const sampleData: ParsedHyp = {
		header: {
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
					size: glbHeader.byteLength,
					mime: "model/gltf-binary"
				},
				{
					type: "script",
					url: "script.js",
					size: scriptBytes.length,
					mime: "text/javascript"
				}
			]
		},
		assets: new Map([
			["model.glb", new Uint8Array(glbHeader)],
			["script.js", scriptBytes]
		])
	};

	return HypParser.serialize(sampleData);
}

export async function saveSampleHypFile(path: string): Promise<void> {
	const fs = await import('fs/promises');
	const buffer = createSampleHyp();
	await fs.writeFile(path, new Uint8Array(buffer));
} 