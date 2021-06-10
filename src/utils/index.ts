import { CompletionItem, Range, CompletionItemKind, Position, Hover, workspace, MarkdownString, CompletionItemTag } from "vscode";
import { Docs } from "../enums";
import { Keyword } from "../interfaces";

export const endsWith = (linePrefix: string, text: string) => {
    return linePrefix.endsWith(text);
}

export const completionItem = ({name, description, insertText, detail}: {name: string, description: string, insertText?: string, detail?: string}, kind: CompletionItemKind) => {
    const item = new CompletionItem(name, kind);
    item.documentation = description;
    item.insertText = insertText;
    item.detail = detail;
    return item;
}

export const getDocs = <T>(docs: Docs) => {
    const jsonObject = require(`../../docs/${docs}.json`);
    return jsonObject as T;
}