const fs = require('node:fs');

export function readStrLines( day : string ) : string[] {
    const puzzle  = fs.readFileSync( `./src/${day}/input` );
    return puzzle.toString().split( "\n" );
}