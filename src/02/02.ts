import { readStrLines } from "../utils";


const LIMITS = new Map<string, number>( [
    [ "red", 12 ],
    [ "green", 13 ],
    [ "blue", 14 ]
] );

export async function solve( day : string ) {
    const games = readStrLines( day );
    const [ ids, powers ] = getValues( games );

    console.log( "Part 1:", ids.reduce( ( a, b ) => a + b, 0 ) );
    console.log( "Part 2:", powers.reduce( ( a, b ) => a + b, 0 ) );
}

function getValues( games : string[] ) : [ number[], number[] ] {
    const ids : number[] = [];
    const powers : number[] = [];
    games.forEach( ( line, index ) => {
        const [ , cubesPart ] = line.split( ": " );
        const quantities = getQuantities( cubesPart );
        const maxVals = getMaxVals( quantities );
        ids.push( possible( maxVals ) ? index + 1 : 0 );
        powers.push( power( maxVals ) );
    } );
    return [ ids, powers ];
}

function getQuantities( cubesPart : string ) : [string, number][] {
    const regex = /(\d+) (blue|green|red)/g;
    let match : RegExpMatchArray | null;
    const quantities : [ string, number ][] = [];
    while ( ( match = regex.exec( cubesPart ) ) !== null ) {
        quantities.push( [ match[2], parseInt( match[1] ) ] );
    }
    return quantities
}

function possible( maxVals : Map<string, number> ) : boolean {
    return Array.from( maxVals.entries() )
        .every( ( [ color, maxVal ] ) => LIMITS.has( color ) && maxVal <= LIMITS.get( color )! );
}

function power( maxVals : Map<string, number> ) : number {
    return Array.from( maxVals.values() ).reduce( ( acc, cur ) => acc * cur, 1 );
}

function getMaxVals( quantities : [ string, number ][] ) : Map<string, number> {
    return new Map<string, number>( Array.from( LIMITS.keys() ).map( color => {
        return [
            color,
            Math.max(
                ...quantities
                    .filter( ( [ c ] ) => c === color )
                    .map( ( [ , v ] ) => v ) )
        ];
    } ) );
}