import * as vscode from 'vscode';
import { HypParser, HypAsset, HypBlueprint, HypHeader, ParsedHyp } from '../parser';

export class HypExplorer {
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new HypExplorer(context);
        return vscode.window.registerCustomEditorProvider('hypViewer.hypExplorer', provider, {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false,
        });
    }

    constructor(private readonly context: vscode.ExtensionContext) { }

    public async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return { uri, dispose: () => { } };
    }

    public async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };

        webviewPanel.webview.html = this.getHtmlForWebview();

        // Handle message from the webview
        webviewPanel.webview.onDidReceiveMessage(async (message) => {
            try {
                switch (message.type) {
                    case 'requestAsset':
                        console.log(`Asset requested: ${message.url}`);
                        break;
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // Initial update
        try {
            const fileData = await vscode.workspace.fs.readFile(document.uri);

            // Convert Buffer to ArrayBuffer properly
            const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.length);

            try {
                const parsed = HypParser.parse(arrayBuffer);
                console.log(`Parsed HYP file successfully with ${parsed.header.assets.length} assets`);

                webviewPanel.webview.postMessage({
                    type: 'update',
                    data: {
                        blueprint: parsed.header.blueprint,
                        assets: parsed.header.assets,
                        assetData: {}
                    }
                });
            } catch (parseError) {
                console.error('Parse error:', parseError);
                vscode.window.showErrorMessage(`Failed to parse HYP file: ${parseError.message || parseError}`);
            }
        } catch (error) {
            console.error('File read error:', error);
            vscode.window.showErrorMessage(`Failed to read HYP file: ${error.message || error}`);
        }
    }

    private getHtmlForWebview(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HYP File Viewer</title>
    <style>
        body { padding: 10px; }
    </style>
</head>
<body>
    <div id="content">
        <h1>HYP File Viewer</h1>
        <p>Loading...</p>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        window.addEventListener('message', event => {
            const message = event.data;
            console.log('Message received:', message.type);
            
            if (message.type === 'update') {
                document.getElementById('content').innerHTML = 
                    '<h1>HYP File Viewer</h1>' +
                    '<h2>' + (message.data.blueprint?.name || 'Unnamed blueprint') + '</h2>' +
                    '<p>Assets: ' + message.data.assets.length + '</p>';
            }
        });
    </script>
</body>
</html>`;
    }
}
