import type {
	AspectData,
	AspectFlatArray,
	OwnedAspect,
	OwnedAspectFlat,
	OwnedAspectFlatArray,
	OwnedAspects
} from "$types";

export interface IOwnedAspects {
	length(): number;
	chkOwnedAspectsBySlotNameMatch(slotFilter: string, name: string): boolean;
	getAspectsByName(name: string): OwnedAspect[] | undefined;
	updateFilteredAspectFlatArray(filteredAspectFlatArray: AspectFlatArray): void;
	getFilteredAspectFlatArray(): AspectFlatArray;
	getOwnedAspectsBySlotMatchArray(slotFilter: string, aspects: OwnedAspect[]): OwnedAspect[];
	getOwnedAspectsBySlotNameMatch(slotFilter: string, name: string): OwnedAspect[];
	checkSlotNameMatch(slotFilter: string, name: string): boolean;
	checkNameMatch(name: string): boolean;
	checkSlotMatch(slotFilter: string, ownedAspect: OwnedAspect): boolean;
	getOwnedAspectsBySlotMatch(slotFilter: string): OwnedAspects;
	valid(): boolean;
	addAspect(name: string, aspect: OwnedAspect): void;
	addAspectsFlatArray(ownedAspects: OwnedAspectFlatArray): void;
	addAspectFlat(ownedAspect: OwnedAspectFlat): void;
	updateOwnedAspects(ownedAspects: { [name: string]: OwnedAspect[] }): void;
	getAllOwnedAspects(): { [name: string]: OwnedAspect[] };
	getAllOwnedAspectsArray(): [string, OwnedAspect[]][];
	updateOwnedAspectsArray(aspectsArray: [string, OwnedAspect[]][]): void;
	checkOwnedAspectsName(aspectName: string): boolean;
	convertArraytoData<T>(data: [string, T[]][]): Record<string, T[]>;
	convertDataToArray<T>(data: Record<string, T[]>): [string, T[]][];
	convertDatatoFlatArray<T>(data: Record<string, T[]>): T[];
	getAspects(): Promise<void>;
	getOwnedAspectsIndexBySlotNameMatch(
		slotFilter: string,
		name: string,
		slotIndex: number
	): number;

	// ... any other methods that should be public
}

/**
 * OwnedAspectsClass represents a collection of owned aspects.
 * This structure allows for efficient lookup and manipulation of owned aspects in the collection.
 * @implements IOwnedAspects
 * @property {Object} aspects - The owned aspects in the collection.
 * @property {AspectFlatArray} aspectFlatArray - An array of OwnedAspectFlat objects.
 * @property {AspectFlatArray} filteredAspectFlatArray - An array of OwnedAspectFlat objects that have been filtered.
 * @property {AspectData} aspectData - An object containing data about various aspects.
 * @property {AspectDetailArray} aspectDetailArray - An array of tuples containing the name of the aspect and an array of aspect details.
 * @property {AspectDetails} aspectDetails - An object containing data about various aspects.
 */
export class OwnedAspectsClass implements IOwnedAspects {
	private aspects: { [name: string]: OwnedAspect[] } = {};
	private aspectFlatArray: AspectFlatArray = [];
	private filteredAspectFlatArray: AspectFlatArray = [];
	//private aspectData: AspectData = []
	/**
	 * Initializes a new instance of the OwnedAspectsClass class.
	 * @param ownedAspects The initial owned aspects to populate the collection with.
	 * @returns An instance of the OwnedAspectsClass class.
	 * @constructor
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.length()); // 1
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // false
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")); // false
	 * console.log(ownedAspects.checkSlotMatch("spider", ownedAspects.getAspectsByName("Aspect of the Spider")[0])); // true
	 * console.log(ownedAspects.checkSlotMatch("spider", ownedAspects.getAspectsByName("Aspect of the Wolf")[0])); // false
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("spider")); // { "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] }
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("wolf")); // {}
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Spider"))); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // []
	 * ownedAspects.addAspect("Aspect of the Wolf", { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" });
	 * console.log(ownedAspects.length()); // 2
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // true
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")); // false
	 * console.log(ownedAspects.checkSlotMatch("spider", ownedAspects.getAspectsByName("Aspect of the Spider")[0])); // true
	 * console.log(ownedAspects.checkSlotMatch("spider", ownedAspects.getAspectsByName("Aspect of the Wolf")[0])); // false
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("spider")); // { "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] }
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("wolf")); // {}
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Spider"))); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // []
	 * ownedAspects.updateOwnedAspects({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	],
	 * 	"Aspect of the Wolf": [
	 * 		{
	 * 			note: "Wolf",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Wolf"
	 * 		}
	 * 	]
	 * });
	 */
	constructor(ownedAspects: { [name: string]: OwnedAspect[] }) {
		this.aspects = ownedAspects;
	}

	/**
	 * Gets the number of owned aspects in the collection.
	 * @returns The number of owned aspects in the collection.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.length()); // 1
	 * ownedAspects.addAspect("Aspect of the Wolf", { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" });
	 * console.log(ownedAspects.length()); // 2
	 * ownedAspects.updateOwnedAspects({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	],
	 * 	"Aspect of the Wolf": [
	 * 		{
	 * 			note: "Wolf",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Wolf"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.length()); // 2
	 */
	public length(): number {
		return Object.keys(this.aspects).length;
	}

	/**
	 * Checks if any owned aspects for a given name match a slot filter.
	 * @param slotFilter - The slot filter to match against.
	 * @param name - The name of the aspect to check.
	 * @returns True if at least one owned aspect for the given name matches the slot filter, false otherwise.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("spider", "Aspect of the Spider")); // true
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("wolf", "Aspect of the Spider")); // false
	 * ownedAspects.addAspect("Aspect of the Wolf", { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" });
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("spider", "Aspect of the Wolf")); // false
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("wolf", "Aspect of the Wolf")); // true
	 * ownedAspects.updateOwnedAspects({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	],
	 * 	"Aspect of the Wolf": [
	 * 		{
	 * 			note: "Wolf",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Wolf"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("spider", "Aspect of the Spider")); // true
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("wolf", "Aspect of the Spider")); // false
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("spider", "Aspect of the Wolf")); // false
	 * console.log(ownedAspects.chkOwnedAspectsBySlotNameMatch("wolf", "Aspect of the Wolf")); // true
	 */
	public chkOwnedAspectsBySlotNameMatch(slotFilter: string, name: string): boolean {
		return (
			!(this.aspects[name] === undefined) &&
			this.aspects[name].filter((aspect) =>
				aspect.note.toLowerCase().includes(slotFilter.toLowerCase())
			).length > 0
		);
	}

	/**
	 * Updates the filtered aspect flat array with the given array.
	 * @param filteredAspectFlatArray - The array to update the filtered aspect flat array with.
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * ownedAspects.updateFilteredAspectFlatArray([
	 * 	{
	 * 		name: "Aspect of the Spider",
	 * 		note: "Spider",
	 * 		time: "2021-08-01T00:00:00.000Z",
	 * 		note_long: "Spider"
	 * 	}
	 * ]);
	 * console.log(ownedAspects.getFilteredAspectFlatArray()); // [ { name: "Aspect of the Spider", note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 */
	public updateFilteredAspectFlatArray(filteredAspectFlatArray: AspectFlatArray): void {
		/*console.log(`updating filtered aspect flat array: Count = ${filteredAspectFlatArray.length} `);*/
		this.filteredAspectFlatArray = filteredAspectFlatArray;
	}

	/**
	 * Returns the filtered aspect flat array.
	 * @returns The filtered aspect flat array.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * ownedAspects.updateFilteredAspectFlatArray([
	 * 	{
	 * 		name: "Aspect of the Spider",
	 * 		note: "Spider",
	 * 		time: "2021-08-01T00:00:00.000Z",
	 * 		note_long: "Spider"
	 * 	}
	 * ]);
	 * console.log(ownedAspects.getFilteredAspectFlatArray()); // [ { name: "Aspect of the Spider", note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 */
	public getFilteredAspectFlatArray(): AspectFlatArray {
		//console.log(
		//	`getting filtered aspect flat array: Count = ${this.filteredAspectFlatArray.length}`
		//);
		return this.filteredAspectFlatArray;
	}

	/**
	 * Returns an array of OwnedAspect objects that match the given slot filter and name.
	 * @param slotFilter - The string to filter the OwnedAspect notes by.
	 * @param aspects - The array of OwnedAspect objects to search.
	 * @returns An array of OwnedAspect objects that match the given slot filter and name.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Spider"))); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Spider"))); // []
	 * ownedAspects.addAspect("Aspect of the Wolf", { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" });
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // []
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // [ { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" } ]
	 * ownedAspects.updateOwnedAspects({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	],
	 * 	"Aspect of the Wolf": [
	 * 		{
	 * 			note: "Wolf",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Wolf"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Spider"))); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Spider"))); // []
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // []
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // [ { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" } ]
	 * ownedAspects.addAspect("Aspect of the Wolf", { note: "Wolf2", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf2" });
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // []
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // [ { note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" }, { note: "Wolf2", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf2" } ]
	 */
	public getOwnedAspectsBySlotMatchArray(
		slotFilter: string,
		aspects: OwnedAspect[]
	): OwnedAspect[] {
		return aspects.filter((aspect) => aspect.note.toLowerCase().includes(slotFilter.toLowerCase()));
	}

	/**
	 * Returns an array of OwnedAspect objects that match the given slot filter and name.
	 * @param slotFilter - The string to filter the OwnedAspect notes by.
	 * @param name - The name of the OwnedAspect array to search.
	 * @returns An array of OwnedAspect objects that match the given slot filter and name.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.getOwnedAspectsBySlotNameMatch("spider", "Aspect of the Spider")); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getOwnedAspectsBySlotNameMatch("wolf", "Aspect of the Spider")); // []
	 */
	public getOwnedAspectsBySlotNameMatch(slotFilter: string, name: string): OwnedAspect[] {
		return this.aspects[name].filter((aspect) =>
			aspect.note.toLowerCase().includes(slotFilter.toLowerCase())
		);
	}

	/**
	 * Return index of OwnedAspect given name, slot, and slotIndex
	 * @param slotFilter - The string to filter the OwnedAspect notes by.
	 * @param name - The name of the OwnedAspect array to search.
	 * @param slotIndex - The index of the OwnedAspect to return.
	 * @returns The index of the OwnedAspect that matches the given slot filter and name.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Wolf": [
	 * 		{
	 * 			note: "Wolf",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Wolf"
	 * 		},
	 * 		{
	 * 			note: "Wolf2",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Wolf2"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.getOwnedAspectsIndexBySlotNameMatch("wolf", "Aspect of the Wolf", 0)); // 0
	 * console.log(ownedAspects.getOwnedAspectsIndexBySlotNameMatch("wolf", "Aspect of the Wolf", 1)); // 1
	 * console.log(ownedAspects.getOwnedAspectsIndexBySlotNameMatch("wolf", "Aspect of the Wolf", 2)); // -1
	 */
	public getOwnedAspectsIndexBySlotNameMatch(
		slotFilter: string,
		name: string,
		slotIndex: number
	): number {
		let matchCount = 0;

		for (let i = 0; i < this.aspects[name].length; i++) {
			if (this.aspects[name][i].note.toLowerCase().includes(slotFilter.toLowerCase())) {
				if (matchCount === slotIndex) {
					return i; // Returns the index of the nth match
				}
				matchCount++;
			}
		}

		return -1; // If the nth match doesn't exist
	}

	/**
	 * Checks if a given slot filter matches the note of any aspect with the given name.
	 * @param slotFilter - The slot filter to check against.
	 * @param name - The name of the aspect to check.
	 * @returns True if a match is found, false otherwise.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkSlotNameMatch("wolf", "Aspect of the Spider")); // false
	 */
	public checkSlotNameMatch(slotFilter: string, name: string): boolean {
		return this.aspects[name].some((aspect) =>
			aspect.note.toLowerCase().includes(slotFilter.toLowerCase())
		);
	}

	/**
	 * Checks if the given name matches an aspect in the `aspects` object.
	 * @param name - The name to check.
	 * @returns `true` if the name matches an aspect, `false` otherwise.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // false
	 */
	public checkNameMatch(name: string): boolean {
		return Object.prototype.hasOwnProperty.call(this.aspects, name); //this.aspects.hasOwnProperty(name)
	}

	/**
	 * Checks if the note of an owned aspect matches a given slot filter.
	 * @param slotFilter - The slot filter to match against.
	 * @param ownedAspect - The owned aspect to check.
	 * @returns True if the note of the owned aspect matches the slot filter, false otherwise.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.checkSlotMatch("spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" })); // true
	 * console.log(ownedAspects.checkSlotMatch("wolf", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" })); // false
	 */
	public checkSlotMatch(slotFilter: string, ownedAspect: OwnedAspect): boolean {
		return ownedAspect.note.toLowerCase().includes(slotFilter.toLowerCase());
	}

	/**
	 * Returns an object containing all owned aspects that have a note containing the specified filter string.
	 * The object is structured as follows: { [aspectName: string]: OwnedAspect[] }
	 * @param slotFilter - The string to filter the notes by.
	 * @returns An object containing all owned aspects that have a note containing the specified filter string.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("spider")); // {}
	 * ownedAspects.addAspect("Aspect of the Spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" });
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("spider")); // { "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] }
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("wolf")); // {}
	 */
	public getOwnedAspectsBySlotMatch(slotFilter: string): OwnedAspects {
		const filteredAspects: { [name: string]: OwnedAspect[] } = {};
		Object.entries(this.aspects).forEach(([name, aspects]) => {
			const filtered = aspects.filter((aspect) =>
				aspect.note.toLowerCase().includes(slotFilter.toLowerCase())
			);
			if (filtered.length > 0) {
				filteredAspects[name] = filtered;
			}
		});
		return filteredAspects;
	}

	/**
	 * Determines whether the collection contains any owned aspects.
	 * @returns True if the collection contains any owned aspects; otherwise, false.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.valid()); // false
	 * ownedAspects.addAspect("Aspect of the Spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" });
	 * console.log(ownedAspects.valid()); // true
	 */
	public valid(): boolean {
		return this.length() > 0;
	}

	/**
	 * Gets the owned aspects with the specified name.
	 * @param name The name of the owned aspects to get.
	 * @returns The owned aspects with the specified name.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.getAspectsByName("Aspect of the Spider")); // undefined
	 * ownedAspects.addAspect("Aspect of the Spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" });
	 * console.log(ownedAspects.getAspectsByName("Aspect of the Spider")); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getAspectsByName("Aspect of the Wolf")); // undefined
	 */
	public getAspectsByName(name: string): OwnedAspect[] | undefined {
		if (this.aspects[name] === undefined) {
			return undefined;
		}
		return this.aspects[name];
	}

	/**
	 * Adds an aspect to the collection.
	 * @param name - The name of the aspect to add.
	 * @param aspect - The aspect to add.
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.addAspect("Aspect of the Spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" });
	 * console.log(ownedAspects.length()); // 1
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // false
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")); // false
	 * console.log(ownedAspects.checkSlotMatch("spider", ownedAspects.getAspectsByName("Aspect of the Spider")[0])); // true
	 * console.log(ownedAspects.checkSlotMatch("spider", ownedAspects.getAspectsByName("Aspect of the Wolf")[0])); // false
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("spider")); // { "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] }
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatch("wolf")); // {}
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("spider", ownedAspects.getAspectsByName("Aspect of the Spider"))); // [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ]
	 * console.log(ownedAspects.getOwnedAspectsBySlotMatchArray("wolf", ownedAspects.getAspectsByName("Aspect of the Wolf"))); // []
	 */
	public addAspect(name: string, aspect: OwnedAspect): void {
		// Check if the aspect array for the given name exists. If not, initialize it.
		const existingAspects = this.aspects[name] || [];
		// Create a new array with the existing aspects and the new one, then assign it back to `this.aspects[name]`.
		this.aspects[name] = [...existingAspects, aspect];
	}

	/**
	 * Adds an array of OwnedAspectFlat objects to the collection.
	 * @param ownedAspects The OwnedAspectFlatArray object to add to the collection.
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.addAspectsFlatArray([
	 * 	{
	 * 		name: "Aspect of the Spider",
	 * 		note: "Spider",
	 * 		time: "2021-08-01T00:00:00.000Z",
	 * 		note_long: "Spider"
	 * 	}
	 * ]);
	 */
	public addAspectsFlatArray(ownedAspects: OwnedAspectFlatArray): void {
		ownedAspects.forEach((ownedAspect) => {
			this.addAspect(ownedAspect.name, {
				note: ownedAspect.note,
				time: ownedAspect.time,
				note_long: ownedAspect.note_long
			});
		});
	}

	/**
	 * Adds a single OwnedAspectFlat object to the collection.
	 * @param ownedAspects
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.addAspectFlat({
	 * 	name: "Aspect of the Spider",
	 * 	note: "Spider",
	 * 	time: "2021-08-01T00:00:00.000Z",
	 * 	note_long: "Spider"
	 * });
	 * console.log(ownedAspects.length()); // 1
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // false
	 */
	public addAspectFlat(ownedAspect: OwnedAspectFlat): void {
		this.addAspect(ownedAspect.name, {
			note: ownedAspect.note,
			time: ownedAspect.time,
			note_long: ownedAspect.note_long
		});
	}

	/**
	 * Updates the owned aspects array with the given aspects object.
	 * @param ownedAspects - The aspects object to update the owned aspects with.
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.updateOwnedAspects({
	 * 	"Aspect of the Spider": [
	 * 		{
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		}
	 * 	]
	 * });
	 * console.log(ownedAspects.length()); // 1
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // false
	 */
	public updateOwnedAspects(ownedAspects: { [name: string]: OwnedAspect[] }): void {
		//console.log(`updating owned aspects: Count = ${Object.keys(ownedAspects).length} `);
		this.aspects = ownedAspects;
	}

	/**
	 * Update aspects[name] with the given OwnedApspect array
	 * @param name - The name of the aspect to update.
	 * @param ownedAspects - The array of OwnedAspect objects to update the aspect with.
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.updateOwnedAspectsByName("Aspect of the Spider", [
	 * 	{
	 * 		note: "Spider",
	 * 		time: "2021-08-01T00:00:00.000Z",
	 * 		note_long: "Spider"
	 * 	}
	 * ]);
	 * console.log(ownedAspects.length()); // 1
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // false
	 */
	public updateOwnedAspectsByName(name: string, ownedAspects: OwnedAspect[]): void {
		this.aspects[name] = ownedAspects;
	}

	/**
	 * Returns all owned aspects.
	 * @returns An object containing all owned aspects.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.getAllOwnedAspects()); // {}
	 * ownedAspects.addAspect("Aspect of the Spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" });
	 * console.log(ownedAspects.getAllOwnedAspects()); // { "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] }
	 */
	public getAllOwnedAspects(): { [name: string]: OwnedAspect[] } {
		return this.aspects;
	}

	/**
	 * Returns an array of tuples containing the aspect name and its corresponding OwnedAspect objects.
	 * @returns An array of tuples containing the aspect name and its corresponding OwnedAspect objects.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.getAllOwnedAspectsArray()); // []
	 * ownedAspects.addAspect("Aspect of the Spider", { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" });
	 * console.log(ownedAspects.getAllOwnedAspectsArray()); // [ [ "Aspect of the Spider", [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] ] ]
	 */
	public getAllOwnedAspectsArray(): [string, OwnedAspect[]][] {
		return Object.entries(this.aspects);
	}

	/**
	 * Updates the owned aspects array with the given aspects array.
	 * @param aspectsArray - An array of tuples containing the name of the aspect and an array of owned aspects.
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.updateOwnedAspectsArray([
	 * 	[
	 * 		"Aspect of the Spider",
	 * 		[
	 * 			{
	 * 				note: "Spider",
	 * 				time: "2021-08-01T00:00:00.000Z",
	 * 				note_long: "Spider"
	 * 			}
	 * 		]
	 * 	]
	 * ]);
	 * console.log(ownedAspects.length()); // 1
	 * console.log(ownedAspects.valid()); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkNameMatch("Aspect of the Wolf")); // false
	 */
	public updateOwnedAspectsArray(aspectsArray: [string, OwnedAspect[]][]): void {
		const aspectsObject: { [name: string]: OwnedAspect[] } = {};
		aspectsArray.forEach(([name, aspects]) => {
			aspectsObject[name] = aspects;
		});
		this.aspects = aspectsObject;
	}

	/**
	 * Checks if the given aspect name is in the owned aspects array.
	 * @param aspectName - The aspect name to check.
	 * @returns True if the aspect name is in the owned aspects array, false otherwise.
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.checkOwnedAspectsName("Aspect of the Spider")); // false
	 * 		ownedAspects.addAspect("Aspect of the Spider", {
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		});
	 * console.log(ownedAspects.checkOwnedAspectsName("Aspect of the Spider")); // true
	 * console.log(ownedAspects.checkOwnedAspectsName("Aspect of the Wolf")); // false
	 */
	public checkOwnedAspectsName(aspectName: string): boolean {
		return this.getAllOwnedAspectsArray()
			.map((obj) => obj[0])
			.includes(aspectName);
	}

	/**
	 *  Method to convert AspectDeteArray to AspectData
	 * @param aspectArray
	 * @returns
	 */
	/*public convertAspectArrayToAspectData(aspectArray: [string, AspectDta[]][]): AspectData {
		const aspectData: AspectData = {};
		aspectArray.forEach(([name, data]) => {
			aspectData[name] = data[0]; // Unwrap `data` from its array
		});
		return aspectData;
	}*/

	/**
	 * Method to convert an arry of tuples to an object
	 * @param data [string, T[]][]
	 * @returns Record<string, T[]>
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.convertArraytoData([])); // {}
	 * console.log(ownedAspects.convertArraytoData([ [ "Aspect of the Spider", [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] ] ])); // { "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] }
	 */
	public convertArraytoData<T>(data: [string, T[]][]): Record<string, T[]> {
		const dataObject: Record<string, T[]> = {};
		data.forEach(([key, value]) => {
			dataObject[key] = value; // Unwrap `value` from its array
		});
		return dataObject;
	}

	/**
	 * Method to convert an object to an array of tuples
	 * @param data Record<string, T>
	 * @returns [string, T[]][]
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.convertDataToArray({})); // []
	 * console.log(ownedAspects.convertDataToArray({ "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] })); // [ [ "Aspect of the Spider", [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] ] ]
	 * 		ownedAspects.addAspect("Aspect of the Spider", {
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		});
	 */
	public convertDataToArray<T>(data: Record<string, T[]>): [string, T[]][] {
		return Object.entries(data).map(([key, value]): [string, T[]] => {
			return [key, value]; // Wrap `value` in an array to form a tuple
		});
	}

	/**
	 * Method to convert an object to an array of tuples
	 * @param data Record<string, T>
	 * @returns [string, T[]][]
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * console.log(ownedAspects.convertDataToArray({})); // []
	 * console.log(ownedAspects.convertDataToArray({ "Aspect of the Spider": [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] })); // [ [ "Aspect of the Spider", [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] ] ]
	 * 		ownedAspects.addAspect("Aspect of the Spider", {
	 * 			note: "Spider",
	 * 			time: "2021-08-01T00:00:00.000Z",
	 * 			note_long: "Spider"
	 * 		});
	 * console.log(ownedAspects.convertDataToArray(ownedAspects.getAllOwnedAspects())); // [ [ "Aspect of the Spider", [ { note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" } ] ] ]
	 */
	public convertDatatoFlatArray<T>(data: Record<string, T[]>): T[] {
		return Object.entries(data).flatMap(([key, value]): T[] => {
			return value; // Wrap `value` in an array to form a tuple
		});
	}

	/**
	 * Method to convert AspectData to AspectDeteArray
	 * @param aspectData
	 * Converts aspect data to an array of aspect detections.
	 * @param aspectData - The aspect data to convert.
	 * @returns An array of aspect detections.
	 */
	/*public convertAspectDataToAspectArray(aspectData: AspectData): AspectDeteArray {
		return Object.entries(aspectData).map(([name, data]): [string, AspectDta[]] => {
			// Explicitly declare `data` as `AspectData`
			const aspectData: AspectDta = data;
			return [name, [aspectData]]; // Wrap `aspectData` in an array to form a tuple
		});
	}*/

	/**
	 * Method to geth Aspects from the database
	 * @returns void
	 * @public
	 * @example
	 * const ownedAspects = new OwnedAspectsClass({});
	 * ownedAspects.getAspects();
	 * console.log(ownedAspects.aspectFlatArray); // [ { name: "Aspect of the Spider", note: "Spider", time: "2021-08-01T00:00:00.000Z", note_long: "Spider" }, { name: "Aspect of the Wolf", note: "Wolf", time: "2021-08-01T00:00:00.000Z", note_long: "Wolf" } ]
	 * console.log(ownedAspects.aspectFlatArray.length); // 2
	 * console.log(ownedAspects.aspectFlatArray[0].name); // "Aspect of the Spider"
	 * console.log(ownedAspects.aspectFlatArray[0].note); // "Spider"
	 * console.log(ownedAspects.aspectFlatArray[0].time); // "2021-08-01T00:00:00.000Z"
	 * console.log(ownedAspects.aspectFlatArray[0].note_long); // "Spider"
	 * console.log(ownedAspects.aspectFlatArray[1].name); // "Aspect of the Wolf"
	 * console.log(ownedAspects.aspectFlatArray[1].note); // "Wolf"
	 * console.log(ownedAspects.aspectFlatArray[1].time); // "2021-08-01T00:00:00.000Z"
	 * console.log(ownedAspects.aspectFlatArray[1].note_long); // "Wolf"
	 * console.log(ownedAspects.aspectFlatArray[2]); // undefined
	 */
	public async getAspects() {
		const aspects_db_url = "/aspects.json";

		try {
			const response = await fetch(aspects_db_url);
			const data = (await response.json()) as AspectData;

			this.aspectFlatArray = Object.entries(data).flatMap(([name, aspects]) =>
				aspects.map((aspect) => ({
					name,
					...aspect
				}))
			);
		} catch (error) {
			console.error(error);
		}
	}
}
