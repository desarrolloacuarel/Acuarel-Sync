// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import { Console } from 'console';

'use strict';

Object.defineProperty(exports, "__esModule", { value: true });

let myvscode = require("vscode");
let basepath = myvscode.workspace.workspaceFolders[0].uri.fsPath;
console.log(basepath);

const fs = require('fs');

let configuracion: {
    ignore: any; destino: string;
};


const terminal = vscode.window.createTerminal();
// this method is called when your extension is activated. your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {

    try {
        // Use the console to output diagnostic information (console.log) and errors (console.error)
        // This line of code will only be executed once when your extension is activated
        console.log('Congratulations, your extension "Acuarel Sync" is now active!');


        /**
         * The command has been defined in the package.json file
         * Now provide the implementation of the command with registerCommand
         * The commandId parameter must match the command field in package.json
         */


        let sincronizar = vscode.commands.registerCommand('acuarelsync.sync1', fileURLToPath => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user


            /* BUSQUEDA DEL ARCHIVO DE CONFIGURACION EN EL DIRECTORIO DEL WORKSPACE */

            let fileContent = "";

            try {
                const data = fs.readFileSync(basepath + '/.acuarelsync/configuracion.json');
                fileContent = data.toString();
                console.log(fileContent);

                configuracion = JSON.parse(fileContent);
            } catch (err) {
                console.error(err);
                console.log("Se ha producido un error al buscar el archivo de configuracion");
            }

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


        let crearConfiguracion = vscode.commands.registerCommand('acuarelsync.configuration', fileURLToPath => {

            vscode.window.showInformationMessage("Se ha ejecutado el comando de configuration");

            var configPath = basepath + '/.acuarelsync/configuracion.json';

            try {
                fs.readFileSync(basepath + '/.acuarelsync/configuracion.json');

                vscode.window.showInformationMessage("Ya existe un archivo de configuración en este directorio, se mostrará en pantalla");

                var pos1 = new vscode.Position(10, 4);
                var openPath = vscode.Uri.file(configPath);
                vscode.workspace.openTextDocument(openPath).then(doc => {
                    vscode.window.showTextDocument(doc).then(editor => {
                        // Line added - by having a selection at the same position twice, the cursor jumps there
                        editor.selections = [new vscode.Selection(pos1, pos1)];
                        // And the visible range jumps there too
                        var range = new vscode.Range(pos1, pos1);
                        editor.revealRange(range);
                    });
                });
            } catch (err) {
                //console.log("Error: " + err);


                fse
                    .outputJson(
                        configPath,
                        {
                            destino: "",
                            ignore: [],
                        },
                        { spaces: 4 }
                    )
                    .then(() => showTextDocument(vscode.Uri.file(configPath)));
            }
        });


        context.subscriptions.push(sincronizar);
        context.subscriptions.push(crearConfiguracion);

    } catch (err) {
        console.log(err);
    }
}

export function showTextDocument(uri: vscode.Uri, option?: vscode.TextDocumentShowOptions) {
    return vscode.window.showTextDocument(uri, option);
}

// this method is called when your extension is deactivated
export function deactivate() { }