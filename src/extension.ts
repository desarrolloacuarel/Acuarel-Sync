// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fse from 'fs-extra';

'use strict';

Object.defineProperty(exports, "__esModule", { value: true});

let myvscode = require("vscode");
let basepath = myvscode.workspace.workspaceFolders[0].uri.fsPath;
console.log(basepath);


const terminal = vscode.window.createTerminal();
const prueba = 'ola';
// this method is called when your extension is activated. your extension is activated the very first time the command is executed

export async function activate(context: vscode.ExtensionContext) {
    
    try{
        // Use the console to output diagnostic information (console.log) and errors (console.error)
        // This line of code will only be executed once when your extension is activated
        console.log('Congratulations, your extension "Acuarel Sync" is now active!');

        /* BUSQUEDA DEL ARCHIVO DE CONFIGURACION EN EL DIRECTORIO DEL WORKSPACE */    
        
        const fs = require('fs');

        let fileContent = "";
        let configuracion: {
            ignore: any;destino: string;
        };

        try {
            const data = fs.readFileSync(basepath+'/.acuarelsync/configuracion.json');
            fileContent = data.toString();
            console.log(fileContent);

            configuracion = JSON.parse(fileContent);
        } catch (err) {
            console.error(err);
            console.log("Se ha producido un error al buscar el archivo de configuracion");
            //Crear un control por si no existe el archivo de configuracion en el workspace ¿Y crearlo?
        }


        /**
         * The command has been defined in the package.json file
         * Now provide the implementation of the command with registerCommand
         * The commandId parameter must match the command field in package.json
         */
        
            
        let disposable = vscode.commands.registerCommand('acuarelsync.sync', fileURLToPath => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            try {
                console.log("Ejecutando");

                //console.log(fileURLToPath);        

                var vscode = require("vscode");
                var f = basepath;
                var fArray = f.split("\\");

                var auxiliar = Promise.resolve(fileURLToPath);
                Promise.all([auxiliar]).then(values => {
                    //console.log(values);

                    //vscode.window.showInformationMessage(values[0]._fsPath);

                    var nombre = values[0]._fsPath.split("\\");
                    //console.log(nombre);

                    /* Definido con un array en 'configuracion.json'*/
                    var listaIgnorar = configuracion.ignore;
                    var comandoIgnorar = "";
                    if (listaIgnorar.length > 0) {
                        for (let index = 0; index < listaIgnorar.length; index++) {
                            comandoIgnorar += "--exclude '" + listaIgnorar[index] + "' ";
                        }
                    }

                    terminal.show();
                    if (nombre.length === fArray.length) {
                        /* wsl rsync -R -arvz --exclude={'',''} .(Origen) /mnt/c/Users/Ordenador/Documents/ParaCopia(Destino) */
                        terminal.sendText("wsl rsync -R -arvz " + comandoIgnorar + ". " + configuracion.destino);
                    } else {
                        if (nombre.length === (fArray.length + 1)) {
                            terminal.sendText("wsl rsync -R -arvz " + comandoIgnorar + "'" + nombre[(nombre.length - 1)] + "' " + configuracion.destino);
                        }

                        /* Para subarchivos */

                        if (nombre.length > (fArray.length + 1)) {
                            var direccion = "";
                            for (let index = fArray.length; index < nombre.length; index++) {
                                direccion += nombre[index];
                                if (index != (nombre.length - 1)) {
                                    direccion += "/";
                                }
                            }

                            terminal.sendText("wsl rsync -R -arvz " + comandoIgnorar + "'" + direccion + "' " + configuracion.destino + "/");
                        }
                    }
                });

            } catch (err) {
                vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
            }

        });


        let disposable2 = vscode.commands.registerCommand('acuarelsync.configuration', async fileURLToPath => {

            vscode.window.showInformationMessage("Se ha ejecutado el comando de configuration"); 

            try {
                fs.readFileSync(basepath+'/.acuarelsync/configuracion.json');
                vscode.window.showInformationMessage("Ya existe un archivo de configuración en este directorio, NO se creará de segunda");
            } catch (err) {
                console.log("Error: " + err);
                
                var configPath = basepath+'/.acuarelsync/configuracion.json';

                return fse
            .outputJson(
              configPath,
              {
                destino: "/mnt/c/Users/Ordenador/Documents/ParaCopia",
                ignore: [],
              },
              { spaces: 4 }
            )
            .then(() => showTextDocument(vscode.Uri.file(configPath)));
            }
        });


        context.subscriptions.push(disposable);
        context.subscriptions.push(disposable2);

    } catch (err) {
        console.log(err);
    }
}

export function showTextDocument(uri: vscode.Uri, option?: vscode.TextDocumentShowOptions) {
    return vscode.window.showTextDocument(uri, option);
  }

// this method is called when your extension is deactivated
export function deactivate() {}