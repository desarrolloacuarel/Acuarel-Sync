# Acuarel-sync README

This is the README for the extension "Acuarel-Rsync".
## Features

This extension allows to create a configuration file that contains the information to access 2 servers for sending files and 1 server access to bring the files from the server to local. All of this options are located in the context menu of the explorer.

Dest1 and Dest2 in the configuration file define the 2 servers to connect for sending files from your workspace and Dest3 defines the server to get the files from.

## Requirements

This extension is based on the command rsync for windows using "wsl" and for linux.

## Extension Settings

## Known Issues

Only can hold 3 destinations due to the limits of the menu integration.
## Release Notes

Upgrades and optimization in the code making it work better and either for windows or linux.

## Sample of use

    
    _comment: "Dest1 y Dest2 synchronize 2 diferent servers, Dest3 is for synchronizing local with a server files",
    _comment2: "Uses SSH access",
    destinations:[
    {
        label: "Sample name for Dest. 1",
        destination: "Destination that can be a local folder (/mnt/c/Users/Computer/Documents/...) or a remote directory (ftpuser@host:/var/ww/vhosts/sample/httpdocs)",
        parameters: "-R -arvz",
        ignore: [".git", "/src"]
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
                        


### 1.0.0

Initial release of Acuarel Sync

### 1.1.0

Autodetection of SO (In case of windows adds wsl else not).

Code optimization and upgrades.

Changes in the configuration file.

Labels for each destination for custom notification on each execution.

### 1.1.1
Fixed error with excludes not working correctly
