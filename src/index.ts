import { DayModule } from "./Types";

const DAY = "02";

const main = ( async function () {
    const module : DayModule = await import( `./${DAY}` );
    const { solve } = module;
    await solve( DAY )
} )();