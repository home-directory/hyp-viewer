import * as vscode from 'vscode';
import { HypExplorer } from './panels/HypExplorer';

export function activate(context: vscode.ExtensionContext) {
  // Register the custom editor provider
  context.subscriptions.push(
    HypExplorer.register(context)
  );

  // Register the "Open with HYP Viewer" command
  context.subscriptions.push(
    vscode.commands.registerCommand('hyp-viewer.openWithViewer', async (uri: vscode.Uri) => {
      if (uri && uri.fsPath.endsWith('.hyp')) {
        await vscode.commands.executeCommand('vscode.openWith', uri, 'hyp-viewer.editor');
      } else {
        vscode.window.showErrorMessage('Please select a .hyp file');
      }
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() { }
