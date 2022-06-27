// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import { fileURLToPath } from 'url';

'use strict';

Object.defineProperty(exports, "__esModule", { value: true });

let myvscode = require("vscode");
let basepath = myvscode.workspace.workspaceFolders[0].uri.fsPath;
console.log(basepath);

const fs = require('fs');

var configuracion: any;


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


        let sincronizar1 = vscode.commands.registerCommand('acuarelsync.sync1', fileURLToPath => {
            buscarConfiguracion();
            sincronizarServidor(fileURLToPath, configuracion.dest1);
        });

        let sincronizar2 = vscode.commands.registerCommand('acuarelsync.sync2', fileURLToPath => {
            buscarConfiguracion();
            sincronizarServidor(fileURLToPath, configuracion.dest2);
        });

        let sincronizar3 = vscode.commands.registerCommand('acuarelsync.sync3', fileURLToPath => {
            buscarConfiguracion();
            sincronizarLocal(fileURLToPath, configuracion.dest3);
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
                            _comment: "Dest1 y Dest2 Funcionan para sincronizar con dos distintos servidores, Dest3 funciona para sincronizar el local con el remoto",
                            _comment2: "ACORDARSE DE BORRAR LOS VALORES POR DEFECTO A VACIOS!!!!!",
                            dest1: {
                                destino: "/mnt/c/Users/Ordenador/Documents/ParaCopia",
                                parametros: "-R -arvz",
                                ignore: [],
                            },
                            dest2: {
                                destino: "/mnt/c/Users/Ordenador/Documents/ParaCopia2",
                                parametros: "-R -arvz",
                                ignore: [],
                            },
                            dest3: {
                                remoto: "",
                                parametros: "",
                                ignore: [],
                            }
                        },
                        { spaces: 4 }
                    )
                    .then(() => showTextDocument(vscode.Uri.file(configPath)));
            }
        });


        context.subscriptions.push(sincronizar1);
        context.subscriptions.push(sincronizar2);
        context.subscriptions.push(sincronizar3);
        context.subscriptions.push(crearConfiguracion);

    } catch (err) {
        console.log(err);
    }
}

function buscarConfiguracion() {
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
}

function sincronizarServidor(fileURLToPath: any, config: any) {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    try {
        console.log("Ejecutando");

        //console.log(fileURLToPath);        

        var vscode = require("vscode");
        var f = basepath;
        var fArray = f.split("\\");

        let auxiliar = Promise.resolve(fileURLToPath);
        Promise.all([auxiliar]).then(values => {
            //console.log(values);

            //vscode.window.showInformationMessage(values[0]._fsPath);

            var nombre = values[0]._fsPath.split("\\");
            //console.log(nombre);

            /* Definido con un array en 'configuracion.json'*/
            var listaIgnorar = config.ignore;
            var comandoIgnorar = "";
            if (listaIgnorar.length > 0) {
                for (let index = 0; index < listaIgnorar.length; index++) {
                    comandoIgnorar += "--exclude '" + listaIgnorar[index] + "' ";
                }
            }

            terminal.show();
            if (nombre.length === fArray.length) {
                /* wsl rsync -R -arvz --exclude={'',''} .(Origen) /mnt/c/Users/Ordenador/Documents/ParaCopia(Destino) */
                terminal.sendText("wsl rsync " + config.parametros + " " + comandoIgnorar + ". " + config.destino);
            } else {
                if (nombre.length === (fArray.length + 1)) {
                    terminal.sendText("wsl rsync " + config.parametros + " " + comandoIgnorar + "'" + nombre[(nombre.length - 1)] + "' " + config.destino);
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

                    terminal.sendText("wsl rsync " + config.parametros + " " + comandoIgnorar + "'" + direccion + "' " + config.destino + "/");
                }
            }
        });

    } catch (err) {
        vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
    }
}

function sincronizarLocal(fileURLToPath: any, config: any) {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    try {
        console.log("Ejecutando");

        //console.log(fileURLToPath);        

        var vscode = require("vscode");
        var f = basepath;
        var fArray = f.split("\\");

        let auxiliar = Promise.resolve(fileURLToPath);
        Promise.all([auxiliar]).then(values => {
            //console.log(values);

            //vscode.window.showInformationMessage(values[0]._fsPath);

            var nombre = values[0]._fsPath.split("\\");
            //console.log(nombre);

            /* Definido con un array en 'configuracion.json'*/
            var listaIgnorar = config.ignore;
            var comandoIgnorar = "";
            if (listaIgnorar.length > 0) {
                for (let index = 0; index < listaIgnorar.length; index++) {
                    comandoIgnorar += "--exclude '" + listaIgnorar[index] + "' ";
                }
            }

            terminal.show();
            if (nombre.length === fArray.length) {
                /* wsl rsync -R -arvz --exclude={'',''} .(Origen) /mnt/c/Users/Ordenador/Documents/ParaCopia(Destino) */
                terminal.sendText("wsl rsync " + config.parametros + " " + comandoIgnorar + config.remoto + " .");
            } else {
                if (nombre.length === (fArray.length + 1)) {
                    terminal.sendText("wsl rsync " + config.parametros + " " + comandoIgnorar + config.remoto + " '" + nombre[(nombre.length - 1)] + "'");
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

                    terminal.sendText("wsl rsync " + config.parametros + " " + comandoIgnorar + config.remoto + "/" + " '" + direccion + "'");
                }
            }
        });

    } catch (err) {
        vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
    }
}

export function showTextDocument(uri: vscode.Uri, option?: vscode.TextDocumentShowOptions) {
    return vscode.window.showTextDocument(uri, option);
}


// this method is called when your extension is deactivated
export function deactivate() { }