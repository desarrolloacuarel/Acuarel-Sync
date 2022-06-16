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
    console.log('Congratulations, your extension "Acuarel Sync" is now active!');       

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('acuarelsync.sync', fileURLToPath => {
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
                terminal.sendText("wsl rsync -R -arvz "+comandoIgnorar+". " + configuracion.destino);                
            }else{                            
                if(nombre.length === (fArray.length+1)){
                    terminal.sendText("wsl rsync -R -arvz "+comandoIgnorar + "'"+ nombre[(nombre.length - 1)] + "' " + configuracion.destino);                                     
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
                    
                    terminal.sendText("wsl rsync -R -arvz "+comandoIgnorar +"'"+ direccion + "' " + configuracion.destino +"/");          
                }                                
            } 
        });

        



    });

    
    let disposable2 = vscode.commands.registerCommand('acuarelsync.configuration', async fileURLToPath => {
        
        vscode.window.showInformationMessage("Se ha ejecutado el comando de configuration");
        //console.log(fileURLToPath);

        terminal.show();
        terminal.sendText("wsl mkdir .acuarelsync");    

        const URLS = await vscode.workspace.findFiles('.acuarelsync/configuracion.json');
        console.log(URLS[0].path);

        const fs = require('fs');

        let fileContent = "";

        try {
            const data = fs.readFileSync(URLS[0].path.substring(1, (URLS[0].path.length)));
            fileContent = data.toString();
            console.log(fileContent);
        } catch (err) {
            console.error(err);
        }

        let json = JSON.parse(fileContent);
        console.log(json.destino);

        //terminal.sendText("copy 'C:/Users/Ordenador/AppData/Local/Programs/Microsoft VS Code/resources/app/extensions/acuarel-sync/src/configuracion-plantilla.json' .acuarelsync/configuracion.json");        

    });

    
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}
  
// this method is called when your extension is deactivated
export function deactivate() { }