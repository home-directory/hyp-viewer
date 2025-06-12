# HYP Viewer

A VS Code extension for viewing and editing Hyperfy `.hyp` files.

## Features

- **View .hyp files**: Parse and display the binary .hyp file format used by Hyperfy
- **Blueprint Editor**: Edit the JSON blueprint configuration with syntax highlighting
- **Asset Management**: View all embedded assets with type, size, and MIME information
- **3D Model Preview**: Preview .glb, .vrm, and other 3D models directly in VS Code using model-viewer
- **Script Preview**: View embedded JavaScript files with syntax highlighting
- **Save & Export**: Save changes back to the original file or export to a new location

## HYP File Format

The `.hyp` format is a custom binary format with the following structure:

```
┌─────────────────────────────────────────────────────────────┐
│ Header Size (4 bytes, little-endian uint32)                │
├─────────────────────────────────────────────────────────────┤
│ JSON Header (contains blueprint + asset metadata)          │
├─────────────────────────────────────────────────────────────┤
│ Asset Data (binary data for each asset, concatenated)      │
└─────────────────────────────────────────────────────────────┘
```

### JSON Header Format

```json
{
  "blueprint": {
    "name": "string",
    "model": "string (optional)",
    "script": "string (optional)", 
    "props": {
      "[key]": { "type": "string", "url": "string" }
    },
    "frozen": boolean
  },
  "assets": [
    {
      "type": "model" | "avatar" | "script",
      "url": "string",
      "size": number,
      "mime": "string"
    }
  ]
}
```

## Usage

1. **Open .hyp files**: Right-click on any `.hyp` file and select "Open with HYP Viewer"
2. **Edit Blueprint**: Modify the JSON blueprint in the left panel
3. **Preview Assets**: Click "Preview" on any asset to view it in the right panel
4. **Save Changes**: Use the "Save" button to save changes or "Export As..." to save to a new location

## Supported Asset Types

- **Models**: .glb, .gltf, .vrm (with 3D preview)
- **Scripts**: .js files (with syntax highlighting)
- **Avatars**: .vrm files (with 3D preview)

## Development

```bash
# Install dependencies
yarn install

# Compile TypeScript
yarn compile

# Watch for changes
yarn watch

# Package extension
yarn vscode:prepublish
```

## Requirements

- VS Code 1.80.0 or higher
- Modern browser support for model-viewer (for 3D previews)

## Known Issues

- Large asset previews may take time to load
- Very large .hyp files (>100MB) may cause performance issues

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.
