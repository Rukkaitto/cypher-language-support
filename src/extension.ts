import { CompletionItem, CompletionItemKind, ExtensionContext, Hover, languages, MarkdownString,  } from 'vscode';
import { Docs } from './enums';
import { Keyword } from './interfaces';
import { completionItem, endsWith, getDocs } from './utils';

export function activate(context: ExtensionContext) {

    const keywordHoverProvider = languages.registerHoverProvider('cypher', {
        provideHover(document, position, token) {
            const keywords = getDocs<Keyword>(Docs.Keywords);
            const keywordsCases = keywords.map(keyword => keyword.name.toLowerCase()).join("|");
            const keywordsRegExp = `\\b(${keywordsCases})\\b`;

            const range = document.getWordRangeAtPosition(position, RegExp(keywordsRegExp, 'i'));

            if(!range) {
                return undefined;
            }

            const word = document.getText(range);
            const keyword = keywords.find(keyword => keyword.name.toLowerCase() === word.toLowerCase().trim())!;

            const name = new MarkdownString();
            name.appendCodeblock(keyword.name, "cypher");
            const description = new MarkdownString()
            description.appendMarkdown(keyword.description);
            const link = new MarkdownString()
            link.appendMarkdown(`[Documentation](${keyword.link})`);

            const markdowns: MarkdownString[] = [];
            markdowns.push(name, description);
            if(keyword.link) {
                markdowns.push(link);
            }

            return new Hover(markdowns, range);
        }
    });

    const keywordCompletionItemProvider = languages.registerCompletionItemProvider('*', {
        provideCompletionItems(document, position, token, context) {
            const keywords = getDocs<Keyword>(Docs.Keywords);
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

    
    context.subscriptions.push(keywordHoverProvider);
    context.subscriptions.push(keywordCompletionItemProvider);
}

export function deactivate() {}