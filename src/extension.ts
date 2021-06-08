import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let hoverProvider = vscode.languages.registerHoverProvider('cypher', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position, RegExp('\\w+(\\.\\w+)*'));
            const word = document.getText(range);
            return {
                contents: [`${word}`]
            };
        }
    });
    context.subscriptions.push(hoverProvider);
}

export function deactivate() {}