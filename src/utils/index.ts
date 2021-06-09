import { CompletionItem, Range, CompletionItemKind, Position, Hover, workspace, MarkdownString, CompletionItemTag } from "vscode";
import { Docs } from "../enums";
import { Keyword } from "../interfaces";

export const endsWith = (linePrefix: string, text: string) => {
    return linePrefix.endsWith(text);
}

export const completionItem = (keyword: Keyword, kind: CompletionItemKind) => {
    const { name, description } = keyword;
    const item = new CompletionItem(name, kind);
    item.documentation = description
    return item;
}

export const getDocs = <T>(docs: Docs) => {
    const jsonObject = require(`../../docs/${docs}.json`);
    return jsonObject as T[];
}