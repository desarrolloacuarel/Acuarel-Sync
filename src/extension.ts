// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
        
        console.log(fileURLToPath);

        var vscode = require("vscode");
        var f = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
        var fArray = f.split("\\");

        var auxiliar = Promise.resolve(fileURLToPath);
        Promise.all([auxiliar]).then(values => {
            console.log(values);

            vscode.window.showInformationMessage(values[0]._fsPath);

            var nombre = values[0]._fsPath.split("\\");
            console.log(nombre);

            /* Definido con un array en 'configuracion.json'*/ 
            var listaIgnorar = configuracion.ignore;
            var comandoIgnorar = "";
            if(listaIgnorar.length > 0){
                for (let index = 0; index < listaIgnorar.length; index++) {
                    comandoIgnorar += "--exclude '"+listaIgnorar[index]+"' ";                    
                }                
            }
            
            terminal.show();
            if(nombre.length === fArray.length){
                /* wsl rsync -R -arvz --exclude={'',''} .(Origen) /mnt/c/Users/Ordenador/Documents/ParaCopia(Destino) */
                terminal.sendText("wsl rsync -R -arvz "+comandoIgnorar+". " + configuracion.archivo);                
            }else{                            
                if(nombre.length === (fArray.length+1)){
                    terminal.sendText("wsl rsync -R -arvz "+comandoIgnorar + "'"+ nombre[(nombre.length - 1)] + "' " + configuracion.archivo);                                     
                }
                                
                /* Para subarchivos */
                
                if(nombre.length > (fArray.length+1)){
                    var direccion = "";
                    for (let index = fArray.length; index < nombre.length; index++) {
                        direccion += nombre[index];                        
                        if(index != (nombre.length-1)){
                            direccion += "/";
                        }
                    }
                    
                    terminal.sendText("wsl rsync -R -arvz "+comandoIgnorar +"'"+ direccion + "' " + configuracion.archivo +"/");          
                }                                
            } 
        });

        



    });
    
    context.subscriptions.push(disposable);
}
  
// this method is called when your extension is deactivated
export function deactivate() { }