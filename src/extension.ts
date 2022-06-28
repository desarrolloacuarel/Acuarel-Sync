// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fse from 'fs-extra';

'use strict';

Object.defineProperty(exports, "__esModule", { value: true });

console.log("vscode");
console.log();
let myvscode = require("vscode");
const basepath = myvscode.workspace.workspaceFolders[0].uri.fsPath;
console.log(basepath);

const fs = require('fs');




const terminal = vscode.window.createTerminal();
// this method is called when your extension is activated. your extension is activated the very first time the command is executed

const activate = (context: vscode.ExtensionContext)=> {


    try {


        /**
         * The command has been defined in the package.json file
         * Now provide the implementation of the command with registerCommand
         * The commandId parameter must match the command field in package.json
         */


		const sincronizar = ( path:any, valor:any )=>{

			const configuracion = buscarConfiguracion( );

			switch(valor){
				case 1: sincronizarServidor(path, configuracion.dest1);break;
				case 2: sincronizarServidor(path, configuracion.dest2);break;
				case 3: sincronizarLocal(path, configuracion.dest3);
			}
		};

        /* Sincronizar1 y Sincronizar2 sincronizan el servidor con los archivos locales*/
        const sincronizar1 = vscode.commands.registerCommand('acuarelsync.sync1', path => {
            sincronizar(path, 1);
        });

        const sincronizar2 = vscode.commands.registerCommand('acuarelsync.sync2', path => {
            sincronizar(path, 2);
        });

        /* Sincronizar3 sincroniza el local con los archivos del servidor*/
        const sincronizar3 = vscode.commands.registerCommand('acuarelsync.sync3', path => {
            sincronizar(path, 3);
        });

		const creaConfig = ()=>{

			vscode.window.showInformationMessage("Se ha ejecutado el comando de configuration");

            const configPath = basepath + '/.vscode/.acuarelsync/configuracion.json';

            try {
                fs.readFileSync(basepath + '/.vscode/.acuarelsync/configuracion.json');

                vscode.window.showInformationMessage("Ya existe un archivo de configuración en este directorio, se mostrará en pantalla");

                var pos1 = new vscode.Position(10, 4);
                var openPath = vscode.Uri.file(configPath);
                vscode.workspace.openTextDocument(openPath).then(doc => {
                    vscode.window.showTextDocument(doc).then(editor => {
                        // Line added - by having a selection at the same position twice, the cursor jumps there
                        editor.selections = [new vscode.Selection(pos1, pos1)];
                        // And the visible range jumps there too
                        const range = new vscode.Range(pos1, pos1);
                        editor.revealRange(range);
                    });
                });
            } catch (err) {
                fse
                    .outputJson(
                        configPath,
                        {
                            _comment: "Dest1 y Dest2 synchronize 2 diferent servers, Dest3 is for synchronizing local with a server files",
                            _comment2: "Uses SSH access",
                            dest1: {
                                destination: "",
                                parameters: "",
                                ignore: [],
                            },
                            dest2: {
                                destination: "",
                                parameters: "",
                                ignore: [],
                            },
                            dest3: {
                                remote: "",
                                parameters: "",
                                ignore: [],
                            }
                        },
                        { spaces: 4 }
                    )
                    .then(() => showTextDocument(vscode.Uri.file(configPath)));
            }
		};

        /* Comprueba si existe el archivo de configuracion y si no existe crea uno con valores vacios */
        const crearConfiguracion = vscode.commands.registerCommand('acuarelsync.configuration', creaConfig);


        context.subscriptions.push(sincronizar1);
        context.subscriptions.push(sincronizar2);
        context.subscriptions.push(sincronizar3);
        context.subscriptions.push(crearConfiguracion);

		// Use the console to output diagnostic information (console.log) and errors (console.error)
        // This line of code will only be executed once when your extension is activated
        console.log('Congratulations, your extension "Acuarel Sync" is now active!');


		// en activacion de vscode, lanzamos chamada  metodo activate mediante  "onStartupFinished"
		creaConfig();


    } catch (err) {
        console.log(err);
    }
};

/* Busqueda del archivo de configuracion en el directorio del workspace */
const buscarConfiguracion = ()=> {
    let fileContent = "";

    try {
        const data = fs.readFileSync(basepath + '/.vscode/.acuarelsync/configuracion.json');
        fileContent = data.toString();
        //console.log(fileContent);

        return JSON.parse(fileContent); // return configuracion;

    } catch (err) {
        console.error(err);
        console.log("Se ha producido un error al buscar el archivo de configuracion");
    }
};

/* Sincronizar los archivos del servidor con los archivos locales */
const sincronizarServidor = (urlRecibida: any, config: any)=> {
    try {
        console.log("Ejecutando");
		console.log({urlRecibida});

        const fArray = basepath.split('/');
		// const mmiPromesa = new Promise( (resolve, reject) => {
		// 	if(1){
		// 		resolve(1); // retardo
		// 	}else{
		// 		reject(`Error`);
		// 	}
		// });

        //const auxiliar = Promise.resolve(urlRecibida);
		console.log(urlRecibida);
        //Promise.all([auxiliar]).then( values => {
		console.log(urlRecibida.fsPath);

		let nombre = urlRecibida.fsPath;

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
		terminal.sendText(`rsync ${config.parameters} ${comandoIgnorar} ${urlRecibida.fsPath} ${config.destination}`);
		// if (nombre.length === fArray.length) {
		// 	terminal.sendText("wsl rsync " + config.parameters + " " + comandoIgnorar + ". " + config.destination);
		// } else {
		// 	if (nombre.length === (fArray.length + 1)) {
		// 		terminal.sendText("wsl rsync " + config.parameters + " " + comandoIgnorar + "'" + nombre[(nombre.length - 1)] + "' " + config.destination);
		// 	}

		// 	/* Para subarchivos */

		// 	if (nombre.length > (fArray.length + 1)) {
		// 		let direccion = "";
		// 		for (let index = fArray.length; index < nombre.length; index++) {
		// 			direccion += nombre[index];
		// 			if (index !== (nombre.length - 1)) {
		// 				direccion += "/";
		// 			}
		// 		}

		// 		terminal.sendText("wsl rsync " + config.parameters + " " + comandoIgnorar + "'" + direccion + "' " + config.destination + "/");
		// 	}
		// }
       //});

    } catch (err) {
		console.log(err);

        vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
    }
};

/* Sincronizar los archivos locales con los del servidor */
const sincronizarLocal = (fileURLToPath: any, config: any) =>{
    try {
        console.log("Ejecutando");

        const fArray = basepath.split("\\");

        let auxiliar = Promise.resolve(fileURLToPath);
        Promise.all([auxiliar]).then(values => {

            let nombre = values[0]._fsPath.split("\\");

            /* Definido con un array en 'configuracion.json'*/
            const listaIgnorar = config.ignore;
            let comandoIgnorar = "";
            if (listaIgnorar.length > 0) {
                for (let index = 0; index < listaIgnorar.length; index++) {
                    comandoIgnorar += "--exclude '" + listaIgnorar[index] + "' ";
                }
            }

            terminal.show();
            if (nombre.length === fArray.length) {
                terminal.sendText("wsl rsync " + config.parameters + " " + comandoIgnorar + config.remote + " .");
            } else {
                if (nombre.length === (fArray.length + 1)) {
                    terminal.sendText("wsl rsync " + config.parameters + " " + comandoIgnorar + config.remote + " '" + nombre[(nombre.length - 1)] + "'");
                }

                /* Para subarchivos */

                if (nombre.length > (fArray.length + 1)) {
                    let direccion = "";
                    for (let index = fArray.length; index < nombre.length; index++) {
                        direccion += nombre[index];
                        if (index !== (nombre.length - 1)) {
                            direccion += "/";
                        }
                    }

                    terminal.sendText("wsl rsync " + config.parameters + " " + comandoIgnorar + config.remote + "/" + " '" + direccion + "'");
                }
            }
        });

    } catch (err) {
        vscode.window.showInformationMessage("Se ha producido un error, ¿Existe el archivo de configuracion?");
    }
};

const showTextDocument = (uri: vscode.Uri, option?: vscode.TextDocumentShowOptions) => {
    return vscode.window.showTextDocument(uri, option);
};


// this method is called when your extension is deactivated
const deactivate = ()=> {};


export{
	activate,
	deactivate,
	showTextDocument

};