// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fse from 'fs-extra';

'use strict';

Object.defineProperty(exports, "__esModule", { value: true });

let myvscode = require("vscode");
const basepath = myvscode.workspace.workspaceFolders[0].uri.fsPath;

const fs = require('fs');

const isWin = process.platform;
let textoIsWin = "";
if(isWin === 'win32'){
    textoIsWin = "wsl ";
}


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
        /* Se encarga de realizar la sincronizacion correspondiente para cada opcion */
        const sincronizar = ( path:any, valor:any )=>{

            const configuracion = buscarConfiguracion( );

            switch(valor){
                case 1: sincronizarServidor(path, configuracion.destinations[0]);break;
                case 2: sincronizarServidor(path, configuracion.destinations[1]);break;
                case 3: sincronizarLocal(path, configuracion.destinations[2]);break;
            }
        };

        /* Sincronizar1 y Sincronizar2 sincronizan el servidor con los archivos locales*/
        let sincronizar1 = vscode.commands.registerCommand('acuarelsync.sync1', fileURLToPath => {
            sincronizar(fileURLToPath, 1);
        });

        let sincronizar2 = vscode.commands.registerCommand('acuarelsync.sync2', fileURLToPath => {
            sincronizar(fileURLToPath, 2);
        });

        /* Sincronizar3 sincroniza el local con los archivos del servidor*/ 
        let sincronizar3 = vscode.commands.registerCommand('acuarelsync.sync3', fileURLToPath => {
            sincronizar(fileURLToPath, 3);
        });

        /* Comprueba si existe el archivo de configuracion y si no existe crea uno con valores vacios */ 
        let crearConfiguracion = vscode.commands.registerCommand('acuarelsync.configuration', fileURLToPath => {
            var configPath = basepath + '/.vscode/acuarelsync.json';

            try {
                fs.readFileSync(basepath + '/.vscode/acuarelsync.json');

                vscode.window.showInformationMessage("Ya existe un archivo de configuración en este directorio, se mostrará en pantalla");

                var pos1 = new vscode.Position(10, 4);
                var openPath = vscode.Uri.file(configPath);
                vscode.workspace.openTextDocument(openPath).then(doc => {
                    vscode.window.showTextDocument(doc).then(editor => {
                        editor.selections = [new vscode.Selection(pos1, pos1)];
                        var range = new vscode.Range(pos1, pos1);
                        editor.revealRange(range);
                    });
                });
            } catch (err) {
                vscode.window.showInformationMessage("Creando un nuevo archivo de configuracion");
                fse
                    .outputJson(
                        configPath,
                        {
                            _comment: "Dest1 y Dest2 synchronize 2 diferent servers, Dest3 is for synchronizing local with a server files",
                            _comment2: "Uses SSH access",
                            destinations:[
                            {
                                label: "Sample name for Dest. 1",
                                destination: "Destination that can be a local folder (/mnt/c/Users/Computer/Documents/...) or a remote directory (ftpuser@host:/var/ww/vhosts/sample/httpdocs)",
                                parameters: "-R -arvz",
                                ignore: []
                            },
                            {
                                label: "Sample name for Dest. 2",
                                destination: "Destination that can be a local folder (/mnt/c/Users/Computer/Documents/...) or a remote directory (ftpuser@host:/var/ww/vhosts/sample/httpdocs)",
                                parameters: "-R -arvz",
                                ignore: []
                            },
                            {
                                label: "Sample name for syncronize local with the server (Downloads the server directory to local)",
                                remote: "ftpuser@host:/var/ww/vhosts/sample/httpdocs",
                                parameters: "-R -arvz",
                                ignore: []
                            }
                            ]
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

/* Busqueda del archivo de configuracion en el directorio del workspace */
const buscarConfiguracion = () => {
    let fileContent = "";

    try {
        const data = fs.readFileSync(basepath + '/.vscode/acuarelsync.json');
        fileContent = data.toString();

        return JSON.parse(fileContent);
    } catch (err) {
        console.error(err);
        console.log("Se ha producido un error al buscar el archivo de configuracion");
    }
};

/* Sincronizar los archivos del servidor con los archivos locales */
const sincronizarServidor = (fileURLToPath: any, config: any) => {
    vscode.window.showInformationMessage(config.label);
    try {
        console.log("Ejecutando");

        let direccionWorkspace = ((myvscode.workspace.workspaceFolders[0].uri.fsPath).replaceAll("\\", "/")).split("/");
        let direccionArchivo = (fileURLToPath.fsPath.replaceAll("\\", "/")).split("/");
        let relativePath = "";

        for (let i = direccionWorkspace.length; i < direccionArchivo.length; i++) {
            relativePath += direccionArchivo[i]+"/";
        }

		/* Definido con un array en 'configuracion.json'*/
		const listaIgnorar = config.ignore;
		let comandoIgnorar = "";
		if (listaIgnorar.length > 0) {
			for (let index = 0; index < listaIgnorar.length; index++) {
				comandoIgnorar += `--exclude ${listaIgnorar[index]}`;
			}
		}

		// Comprobar si terminal abierto!!!!??
		terminal.show();
		terminal.sendText(textoIsWin+`rsync ${config.parameters} ${comandoIgnorar} '`+relativePath+`' '${config.destination}'`);

    } catch (err) {
        vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
    }
};

/* Sincronizar los archivos locales con los del servidor */
const sincronizarLocal = (fileURLToPath: any, config: any) => {
    vscode.window.showInformationMessage(config.label);
    try {
        console.log("Ejecutando");

        let direccionWorkspace = ((myvscode.workspace.workspaceFolders[0].uri.fsPath).replaceAll("\\", "/")).split("/");
        let direccionArchivo = (fileURLToPath.fsPath.replaceAll("\\", "/")).split("/");
        let relativePath = "";

        for (let i = direccionWorkspace.length; i < direccionArchivo.length; i++) {
            relativePath += direccionArchivo[i]+"/";
        }

		/* Definido con un array en 'configuracion.json'*/
		const listaIgnorar = config.ignore;
		let comandoIgnorar = "";
		if (listaIgnorar.length > 0) {
			for (let index = 0; index < listaIgnorar.length; index++) {
				comandoIgnorar += `--exclude ${listaIgnorar[index]}`;
			}
		}

		// Comprobar si terminal abierto!!!!??
		terminal.show();
		terminal.sendText(textoIsWin+`rsync ${config.parameters} ${comandoIgnorar} '${config.remote}' '`+relativePath+`'`);

    } catch (err) {
        vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
    }
};

/* Mostrar el documento de configuracion de la extension */
export const showTextDocument = (uri: vscode.Uri, option?: vscode.TextDocumentShowOptions) => {
    return vscode.window.showTextDocument(uri, option);
};


/* Metodo al desactivar la extension */
export const deactivate = () => { };
