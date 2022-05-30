// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import configuracion from './configuracion.json';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', (arg1: any) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
        console.log("Ejecutando");

        var pos1 = new vscode.Position(10, 4);
        var openPath = vscode.Uri.file('C:/Users/Ordenador/AppData/Local/Programs/Microsoft VS Code/resources/app/extensions/helloworld/src/prueba.txt');
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc).then(editor => {
                // Line added - by having a selection at the same position twice, the cursor jumps there
                editor.selections = [new vscode.Selection(pos1,pos1)]; 

                // And the visible range jumps there too
                var range = new vscode.Range(pos1, pos1);
                let remoteConfig;
                            
                editor.revealRange(range);
            });
        });        

        const terminal = vscode.window.createTerminal();
        terminal.show();
        terminal.sendText(configuracion.comando1);     
        terminal.sendText(configuracion.comando2);
        
		vscode.window.showInformationMessage('Hello World from ASD!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
