import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "helloworld-sample" is now active!');

    let hoverProvider = vscode.languages.registerHoverProvider('cypher', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            return {
                contents: [word]
            };
        }
    });
    context.subscriptions.push(hoverProvider);
}

export function deactivate() {}