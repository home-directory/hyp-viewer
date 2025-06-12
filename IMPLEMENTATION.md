# HYP Viewer Implementation Summary

## Overview

The HYP Viewer is a VS Code extension for viewing and editing Hyperfy `.hyp` files. It provides a rich interface for working with the binary `.hyp` format, including blueprint editing, asset management, and 3D model previews.

## Architecture

### Core Components

1. **Parser (`src/parser.ts`)**
   - Binary format parser for `.hyp` files
   - Handles little-endian uint32 header size
   - JSON header parsing with asset metadata
   - Asset data extraction and serialization
   - Blob URL creation for webview consumption

2. **HypExplorer (`src/panels/HypExplorer.ts`)**
   - Custom text editor provider implementation
   - WebView-based UI with VS Code theming
   - Two-panel layout: blueprint editor + asset browser
   - Save/export functionality
   - Asset preview system

3. **Extension Entry Point (`src/extension.ts`)**
   - Extension activation and command registration
   - Custom editor provider registration
   - Context menu integration

### File Structure

```
src/
├── parser.ts              # Binary format parser
├── panels/
│   └── HypExplorer.ts     # Main editor interface
├── types.ts               # TypeScript type definitions
├── extension.ts           # Extension entry point
└── test-utils/
    └── createSampleHyp.ts # Test utilities
```

## Binary Format Implementation

### Format Specification

```
┌─────────────────────────────────┐
│ Header Size (4 bytes, uint32LE) │
├─────────────────────────────────┤
│ JSON Header (variable length)   │
├─────────────────────────────────┤
│ Asset Data (concatenated)       │
└─────────────────────────────────┘
```

### Parser Logic

1. **Read header size**: First 4 bytes as little-endian uint32
2. **Extract JSON header**: Decode UTF-8 text from header bytes
3. **Parse asset metadata**: Extract asset list from JSON
4. **Read asset data**: Sequential reading based on asset sizes
5. **Create asset map**: Map asset URLs to binary data

### Serialization

1. **JSON header encoding**: UTF-8 encoding of header object
2. **Size calculation**: Total size = 4 + header_size + sum(asset_sizes)
3. **Binary construction**: Sequential writing of header size, JSON, and assets
4. **Little-endian compliance**: Ensures cross-platform compatibility

## WebView Interface

### Features

- **Blueprint Editor**: JSON editor with syntax highlighting
- **Asset List**: Displays type, size, and MIME information
- **3D Preview**: Integrated model-viewer for GLB/GLTF/VRM files
- **Script Preview**: Syntax-highlighted JavaScript display
- **Save/Export**: Direct file modification and export functionality

### Communication Protocol

- **Message Types**: `update`, `save`, `export`
- **Asset Transfer**: Base64 encoding for binary data transfer
- **State Management**: Client-side state with VS Code API integration

## Key Implementation Details

### Asset Handling

```typescript
// Base64 encoding for WebView transfer
private serializeAssets(assets: Map<string, Uint8Array>): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  for (const [url, data] of assets) {
    result[url] = btoa(String.fromCharCode(...data));
  }
  return result;
}
```

### File I/O

```typescript
// Reading .hyp files
const fileData = await vscode.workspace.fs.readFile(document.uri);
const parsed = HypParser.parse(fileData.buffer);

// Writing .hyp files
const buffer = HypParser.serialize(parsed);
await vscode.workspace.fs.writeFile(uri, new Uint8Array(buffer));
```

### Model Preview

```html
<!-- 3D model display using model-viewer -->
<model-viewer 
  src="blob:..." 
  auto-rotate 
  camera-controls>
</model-viewer>
```

## Testing

### Sample File Generation

- **`generate-sample.js`**: Creates test `.hyp` files
- **`test-parser.js`**: Validates parser functionality
- **Sample includes**: Minimal GLB header + JavaScript content

### Parser Validation

```javascript
// Verify round-trip consistency
const original = createSampleHyp();
const parsed = HypParser.parse(original);
const reserialized = HypParser.serialize(parsed);
// original should equal reserialized
```

## Performance Considerations

1. **Large Files**: Asset data transferred as base64 (33% overhead)
2. **Memory Usage**: Full file loaded into memory for editing
3. **Preview Loading**: Lazy loading of 3D models
4. **Update Frequency**: Debounced document change events

## Security

1. **Script Sandboxing**: Preview only, no script execution
2. **Blob URLs**: Temporary object URLs for asset preview
3. **JSON Validation**: Safe JSON parsing with error handling
4. **File System**: Uses VS Code's secure file system APIs

## Future Enhancements

1. **Asset Management**: Add/remove assets functionality
2. **Blueprint Validation**: Schema validation for blueprints
3. **Performance**: Streaming for large files
4. **Integration**: Direct Hyperfy deployment
5. **Templates**: Blueprint templates and scaffolding

## Dependencies

- **VS Code API**: 1.80.0+
- **TypeScript**: 5.1.3
- **model-viewer**: Latest (CDN)
- **Build Tools**: esbuild, yarn

## Build Process

```bash
yarn install    # Install dependencies
yarn compile    # Build extension
yarn watch      # Development mode
```

The extension is now ready for installation and testing in VS Code! 