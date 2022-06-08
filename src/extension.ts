// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fileURLToPath } from 'url';
import * as vscode from 'vscode';
import configuracion from './configuracion.json';

'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const terminal = vscode.window.createTerminal();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');            

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('helloworld.helloWorld', fileURLToPath => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        console.log("Ejecutando");
        
        /* Abrir un documento
        var pos1 = new vscode.Position(10, 4);
        var openPath = vscode.Uri.file('C:/Users/Ordenador/AppData/Local/Programs/Microsoft VS Code/resources/app/extensions/helloworld/src/prueba.txt');
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc).then(editor => {
                // Line added - by having a selection at the same position twice, the cursor jumps there
                editor.selections = [new vscode.Selection(pos1, pos1)];

                // And the visible range jumps there too
                var range = new vscode.Range(pos1, pos1);

                editor.revealRange(range);
            });
        });
        */

        /* Direccion del archivo que este abierto
        var vscode2 = require("vscode");
        var path = require("path");    
        var currentlyOpenTabfilePath = vscode2.window.activeTextEditor.document.fileName;
        var currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
        
        vscode.window.showInformationMessage(currentlyOpenTabfilePath);            
        //vscode.window.showInformationMessage(currentlyOpenTabfileName);

        const terminal = vscode.window.createTerminal();
        terminal.show();
        terminal.sendText("copy " + currentlyOpenTabfileName + " " + configuracion.archivo);    
        vscode.window.showInformationMessage('Hello World from ASD!');
        */

        /* Direccion del explorer
        var vscode2 = require("vscode");
        let wf = vscode2.workspace.workspaceFolders[0].uri.path ;
        let f = vscode2.workspace.workspaceFolders[0].uri.fsPath ; 

        var message = `YOUR-EXTENSION: folder: ${wf} - ${f}` ;

        vscode.window.showInformationMessage(message);
        vscode.window.showInformationMessage(uri.fsPath);
        */

        //vscode.commands.executeCommand('copyFilePath');

       /*
        var originalClipboard = vscode.env.clipboard.readText();
        var auxiliar = Promise.resolve(originalClipboard);
        var valorPath;
        Promise.all([auxiliar]).then(values => {
            console.log(values);

            vscode.window.showInformationMessage(values[0]);
        });
        */

        //var prueba = vscode.workspace.findFiles;
        console.log(fileURLToPath);

        var vscode2 = require("vscode");
        var f = vscode2.workspace.workspaceFolders[0].uri.fsPath ; 
        var fArray = f.split("\\");

        var auxiliar = Promise.resolve(fileURLToPath);
        Promise.all([auxiliar]).then(values => {
            console.log(values);

            vscode.window.showInformationMessage(values[0]._fsPath);

            var nombre = values[0]._fsPath.split("\\");
            console.log(nombre);

            var fs = require('fs');
            
            terminal.show();
            if(nombre.length === fArray.length){
                terminal.sendText("xcopy /E/I . "+" " + configuracion.archivo);                
            }else{
                if(nombre.length === (fArray.length+1)){
                    if(fs.existsSync(values[0]._fsPath) && fs.lstatSync(values[0]._fsPath).isDirectory()){
                        terminal.sendText("robocopy " + nombre[(nombre.length - 1)] + " " + configuracion.archivo + "\\" + nombre[(nombre.length - 1)] + " /Z /E");                                     
                    }else{                    
                        terminal.sendText("xcopy " + nombre[(nombre.length - 1)] + " " + configuracion.archivo);   
                    }
                }
                
                /* En desarrollo para subarchivos */
                
                if(nombre.length > (fArray.length+1)){
                    var direccion = "";
                    for (let index = fArray.length; index < nombre.length; index++) {
                        direccion += nombre[index];                        
                        if(index != (nombre.length-1)){
                            direccion += "\\";
                        }
                    }
                    terminal.sendText("xcopy "+ direccion + " " + configuracion.archivo +"\\"+ direccion);
                    if(fs.existsSync(values[0]._fsPath) && fs.lstatSync(values[0]._fsPath).isDirectory()){
                        terminal.sendText("d");                                 
                    }else{                    
                        terminal.sendText("f"); 
                    }                    
                }                                
            } 
        });

        



    });
    
    context.subscriptions.push(disposable);
}
  
// this method is called when your extension is deactivated
export function deactivate() { }