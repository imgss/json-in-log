"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    const regexDec = /\{.+\}/;
    let hover = vscode.languages.registerHoverProvider({ scheme: '*', language: 'log' }, {
        provideHover(document, position) {
            const { line, character } = position;
            const { text } = document.lineAt(line);
            const match = text.match(regexDec);
            if (match) {
                const json = match[0];
                if (match.index >= character) {
                    return null;
                }
                try {
                    const obj = JSON.parse(json);
                    const fmtJson = JSON.stringify(obj, null, 2);
                    return new vscode.Hover({
                        language: 'json',
                        value: fmtJson
                    });
                }
                catch (err) {
                    console.error(json, err);
                }
            }
            return null;
        }
    });
    context.subscriptions.push(hover);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map