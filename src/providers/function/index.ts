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
            console.log(word);
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

}