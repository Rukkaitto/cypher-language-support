import { CompletionItem, Range, CompletionItemKind, Position, Hover, workspace, MarkdownString, CompletionItemTag } from "vscode";
import { Docs } from "../enums";
import { Keyword } from "../interfaces";

export const endsWith = (linePrefix: string, text: string) => {
    return linePrefix.endsWith(text);
}

export const completionItem = ({name, documentation, insertText, detail, deprecated}: {name: string, documentation?: string, insertText?: string, detail?: string, deprecated?: boolean}, kind: CompletionItemKind) => {
    let item = new CompletionItem(name, kind);

    item.documentation = new MarkdownString(documentation);
    item.insertText = insertText;
    item.detail = detail;
    item.tags = deprecated ? [CompletionItemTag.Deprecated] : undefined;
    return item;
}

export const getDocs = <T>(docs: Docs) => {
    const jsonObject = require(`../../docs/${docs}.json`);
    return jsonObject as T;
}