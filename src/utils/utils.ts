const fs = require('node:fs');

export function readStrLines( day : string ) : string[] {
    return read( day ).split( "\n" );
}

export function read( day : string ) : string {
    return fs.readFileSync( `./src/${day}/input`, "utf8" ).toString();
}