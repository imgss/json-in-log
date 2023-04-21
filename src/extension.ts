// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

type EscapeMap = Record<string, string>;

const regexEscape = /\/(?<regex>.*)\/(?<flags>d?g?i?m?s?u?y?)/;
const defaultEscapes: EscapeMap = {
	'\\\\\\\\': '保护双反斜杠', //保护
	'\\\\n': '\n',
	'\\\\r': '\r',
	'\\\\t': '\t',
	保护双反斜杠: '\\\\',
};

function escape(str: string, escapesMap = defaultEscapes) {
	for (const key in escapesMap) {
		const replace = escapesMap[key];
		const match = regexEscape.exec(key);
		const isRegexp = match !== null;

		let regex: RegExp;
		if (isRegexp) {
			const re = match.groups?.regex;
			const flags = match.groups?.flags;
			if (re === undefined) {
				throw new Error(`正则表达式 “${key}”=>${replace}  出错了`);
			}
			regex = RegExp(re, flags);
		} else {
			regex = RegExp(key, 'g');
		}

		str = str.replace(regex, replace);
		console.log(`"${key}" => "${replace}" len:${str.length}\n\t${str.split('\n').join('\n\t')}`);
	}
	return str;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)

	const regexDec = /(\{.+\})|(\[\{.+?\}\])/;
	const hover = vscode.languages.registerHoverProvider(
		{ scheme: '*', language: 'log' },
		{
			provideHover(document: vscode.TextDocument, position: vscode.Position) {
				const { line, character } = position;
				const { text } = document.lineAt(line);

				const match = text.match(regexDec);
				if (match) {
					const json = match[0];

					if ((match.index as number) >= character) {
						return null;
					}

					try {
						console.log('json:', json);
						const obj = JSON.parse(json) as unknown;
						let fmtJson = JSON.stringify(obj, null, 2);
						const useEscapes = vscode.workspace
							.getConfiguration('json-in-log')
							.get<boolean>('useEscapes', false);
						const escapesMap = vscode.workspace.getConfiguration('json-in-log').get<EscapeMap>('escapes');
						if (useEscapes) {
							fmtJson = escape(fmtJson, escapesMap);
						}

						return new vscode.Hover({
							language: 'json',
							value: fmtJson,
						});
					} catch (err) {
						console.error(json, err);
					}
				}
				return null;
			},
		}
	);

	context.subscriptions.push(hover);
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
