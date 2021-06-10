import { ExtensionContext } from 'vscode';
import { FunctionProvider } from './providers/function';
import { KeywordProvider } from './providers/keyword';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(KeywordProvider.hover);
    context.subscriptions.push(KeywordProvider.completionItem);
    context.subscriptions.push(FunctionProvider.hover);
    context.subscriptions.push(FunctionProvider.baseCompletionitem);
    context.subscriptions.push(FunctionProvider.dotCompletionItem);
}

export function deactivate() {}