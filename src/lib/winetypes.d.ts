export interface Producer {
	[Producer: string]: Wine[];
}
export interface Cellar {
	[Producer: string]: Wine[];
}

export interface Wine {
	"Wine Name": string;
	"Vineyard Location": string;
	Variety: string;
	Vintage: number;
	Bin: string;
	Qty: number;
	Purchased: string;
	Notes: string;
}
//type Cellar = Producer[];
export type CellarTuple = [string, Wine[]][]; // Array of tuples
