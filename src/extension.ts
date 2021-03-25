// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)

	const regexDec = /(\{.+\})|(\[\{.+?\}\])/;
	let hover = vscode.languages.registerHoverProvider({ scheme: '*', language: 'log' }, {
		provideHover(document :vscode.TextDocument, position: vscode.Position) {
			const {line, character} = position;
			const {text} = document.lineAt(line);

			const match = text.match(regexDec);
			if (match) {
				const json = match[0];

				if (<number>match.index >= character) {
					return null;
				}

				try {
					console.log('json:', json);
					const obj = JSON.parse(json);
					let fmtJson = JSON.stringify(obj, null, 2);
          const forceWrap = vscode.workspace.getConfiguration('json-in-log').get('forceWordWrap');
          if (forceWrap) {
            fmtJson = fmtJson.replace(/\\n/g, '\n');
          }

					return new vscode.Hover({
						language: 'json',
						value: fmtJson
					});
				} catch (err) {
					console.error(json, err);
				}
			}
			return null;
		}
	});

	context.subscriptions.push(hover);
}

// this method is called when your extension is deactivated
export function deactivate() {}
