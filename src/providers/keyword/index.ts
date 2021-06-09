import { CompletionItem, CompletionItemKind, Hover, languages, MarkdownString } from "vscode";
import { Docs, Language } from "../../enums";
import { Keyword } from "../../interfaces";
import { completionItem, getDocs } from "../../utils";

export class KeywordProvider {
    static hover = languages.registerHoverProvider(Language.Cypher, {
        provideHover(document, position, token) {
            const keywords = getDocs<Keyword[]>(Docs.Keywords);
            const keywordsCases = keywords.map(keyword => keyword.name.toLowerCase()).join("|");
            const keywordsRegExp = `(?<!\\.)\\b(${keywordsCases})\\b(?!(:|\\.))`;

            const range = document.getWordRangeAtPosition(position, RegExp(keywordsRegExp, 'i'));

            if(!range) {
                return undefined;
            }

            const word = document.getText(range);
            const keyword = keywords.find(keyword => keyword.name.toLowerCase() === word.toLowerCase().trim())!;

            const name = new MarkdownString().appendCodeblock(keyword.name, Language.Cypher);
            const description = new MarkdownString().appendMarkdown(keyword.description);
            const link = new MarkdownString().appendMarkdown(`[Documentation](${keyword.link})`);

            const contents: MarkdownString[] = [];
            contents.push(name, description);
            keyword.link && contents.push(link);

            return new Hover(contents, range);
        }
    });

    static completionItem = languages.registerCompletionItemProvider(Language.Cypher, {
        provideCompletionItems(document, position, token, context) {
            const keywords = getDocs<Keyword[]>(Docs.Keywords);
            const range = document.getWordRangeAtPosition(position, RegExp('\\w+(\\.\\w+)*'));
            const word = document.getText(range);
            
            const completionItems: CompletionItem[] = [];
            keywords.forEach(keyword => {
                if(keyword.name.toLowerCase().trim().includes(word.toLowerCase().trim())) {
                    completionItems.push(completionItem(keyword, CompletionItemKind.Keyword));
                }
            });
        
            return completionItems;
        }
    });
}

