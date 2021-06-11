import { CompletionItem, CompletionItemKind, Hover, languages, MarkdownString } from "vscode";
import { Docs, Language } from "../../enums";
import { Function } from "../../interfaces";
import { completionItem, getDocs } from "../../utils";

const getFunction = (functions: any, parts: string[]): Function => {
    if(parts.length === 0) {
        return functions;
    } else {
        return getFunction(functions[parts[0]], parts.slice(1));
    }
}

export class FunctionProvider {
    static hover = languages.registerHoverProvider(Language.Cypher, {
        provideHover(document, position, token) {
            const functions = getDocs<any>(Docs.Functions);
            const functionsRegExp = "(\\w+\\.)*(\\w+)";

            const range = document.getWordRangeAtPosition(position, RegExp(functionsRegExp));

            if(!range) {
                return undefined;
            }

            const word = document.getText(range);
            const wordParts = word.split(".");
            const func = getFunction(functions, wordParts);

            const name = new MarkdownString().appendCodeblock(func.name, Language.Cypher);
            const description = new MarkdownString().appendMarkdown(func.description);
            const link = new MarkdownString().appendMarkdown(`[Documentation](${func.link})`);

            const contents: MarkdownString[] = [];
            contents.push(name, description);
            func.link && contents.push(link);

            return new Hover(contents, range);
        }
    });

    static baseCompletionitem = languages.registerCompletionItemProvider(Language.Cypher, {
        provideCompletionItems(document, position, token, context) {
            const functions = getDocs<any>(Docs.Functions);
            
            const baseElements = Object.keys(functions);
            const completionItems = baseElements.map(baseElement => {
                if(baseElement === "apoc") {
                    return completionItem({name: baseElement}, CompletionItemKind.Class);
                } else {
                    const func = getFunction(functions, [baseElement]) as Function;
                    return completionItem({name: baseElement, documentation: func.description, detail: func.name}, CompletionItemKind.Function);
                }
            });
            return completionItems;
        }
    });

    static dotCompletionItem = languages.registerCompletionItemProvider(Language.Cypher, {
        provideCompletionItems(document, position, token, context) {
            const functions = getDocs<any>(Docs.Functions);
            const linePrefix = document.lineAt(position).text.substr(0, position.character);

            const matches = linePrefix.match(RegExp("(\\b\\w+\\b\\.)*(\\b\\w+\\b)+(?=\\.$)"));
            const completionItems: CompletionItem[] = [];

            if(matches) {
                const functionParts = matches[0].split(".");
                const func = getFunction(functions, functionParts);

                for(const [key, value] of Object.entries(func)) {
                    let item: CompletionItem;
                    if(!value.name) {
                        item = completionItem({name: key}, CompletionItemKind.Function);
                    } else {
                        item = completionItem({name: key, documentation: value.description, detail: value.name, deprecated: value.deprecated}, CompletionItemKind.Function);
                    }
                    completionItems.push(item);
                }
            }

            return completionItems;
        }
    }, '.');
}