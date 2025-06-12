# Changelog

All notable changes to the HYP Viewer extension will be documented in this file.

## [0.1.0] - 2024-06-07

### Added
- Initial release of HYP Viewer extension
- Support for parsing and viewing .hyp binary files
- Blueprint JSON editor with syntax highlighting
- Asset management panel showing type, size, and MIME information
- 3D model preview using model-viewer for .glb, .gltf, and .vrm files
- Script preview with syntax highlighting for JavaScript files
- Save and export functionality for modified .hyp files
- Context menu integration: "Open with HYP Viewer"
- Binary format parser and serializer for .hyp files
- Support for Hyperfy blueprint format with props and metadata

### Features
- **File Format Support**: Complete .hyp binary format parsing
- **Visual Editor**: Split-pane interface with blueprint editor and asset browser
- **3D Preview**: Integrated model-viewer for 3D assets
- **Asset Management**: View all embedded assets with metadata
- **Export Capability**: Save changes or export to new files

### Technical Details
- Custom text editor provider for .hyp files
- WebView-based UI with VS Code theming
- TypeScript implementation with full type safety
- Modular parser architecture
- Base64 asset serialization for WebView communication