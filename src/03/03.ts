import { read } from "../utils";
import { ElementInRow } from "./Types";

export async function solve( day : string ) {
    const engine = read( day );
    const rows = engine.split( "\n" );
    const numbers = getAllNumbers( rows );
    const symbols = getUniqueSymbols( engine );

    // Part 1
    const validNumbers = getValidNumbers( rows, numbers, symbols );
    console.log( "Part 1:", validNumbers.reduce( ( a, b ) => a + b, 0 ) );

    // Parts
    const gearRatios : number[] = getGearRatios( rows, numbers );
    console.log( "Part 2:", gearRatios.reduce( ( a, b ) => a + b, 0 ) );
}

function getAllNumbers( rows : string[] ) {
    return rows.flatMap( ( row, index ) : [ ElementInRow, number ][] => {
        return getInRow( /\d+/g, row ).map( n => [ n, index ] );
    } );
}

function getUniqueSymbols( engine : string ) : Set<string> {
    return new Set<string>( [ ...engine.matchAll( /[^\d.\n]/g ) ].map( m => m[0] ) );
}

function getValidNumbers( rows : string[], numbers : [ ElementInRow, number ][], symbols : Set<string> ) : number[] {
    const lineLength = rows[0].length;
    return numbers
        .filter( ( [ [ , numberPos ], numberRow ] ) => {
            return isSymbolAdjacent( numberRow, numberPos, rows, lineLength, symbols );
        } )
        .map( ( [ [ n ] ] ) => {
            return parseInt( n );
        } );
}

function isSymbolAdjacent( numberRow : number, numberPos : [ number, number ], rows : string[],
                           lineLength : number, symbols : Set<string> ) : boolean {
    const [ start, end ] = numberPos;
    const rowPrev = Math.max( numberRow - 1, 0 );
    const rowNext = Math.min( numberRow + 1, rows.length - 1 );
    const searchStart = Math.max( start - 1, 0 );
    const searchEnd = Math.min( end + 1, lineLength - 1 );
    for ( const sym of symbols ) {
        if ( [
            rows[rowPrev].slice( searchStart, searchEnd ),
            rows[numberRow].slice( searchStart, searchEnd ),
            rows[rowNext].slice( searchStart, searchEnd )
        ].some( row => row.includes( sym ) ) ) {
            return true;
        }
    }
    return false;
}

function getGearRatios( rows : string[], numbers : [ ElementInRow, number ][] ) : number[] {
    return rows
        .flatMap( ( row, index ) : [ ElementInRow, number ][] => {
            return getInRow( /\*/g, row ).map( element => [ element, index ] );
        } )
        .map( ( [ [ , [ gearPos ] ], index ] ) => {
            return getAdjacentNumbers( index, gearPos, numbers );
        } )
        .filter( adjacentNumbers => adjacentNumbers.length === 2 )
        .map( ( [ a, b ] ) => a * b );
}

function getAdjacentNumbers( gearRow : number, gearPos : number, numbers : [ ElementInRow, number ][] ) : number[] {
    return numbers
        .filter( ( [ [ , [ numberStart, numberEnd ] ], numberRow ] ) => {
            return ( gearRow - 1 <= numberRow ) && ( numberRow <= gearRow + 1 ) &&
                ( numberStart - 1 <= gearPos ) && ( gearPos <= numberEnd );
        } )
        .map( ( [ [ n ] ] ) => {
            return parseInt( n );
        } );
}

function getInRow( regex : RegExp, row : string ) : ElementInRow[] {
    let match : RegExpMatchArray | null;
    const elements : ElementInRow[] = [];
    while ( ( ( match = regex.exec( row ) ) !== null ) && match.index !== undefined ) {
        elements.push( [ match[0], [ match.index, match.index + match[0].length ] ] );
    }
    return elements;
}