/**
 * OwnedAspect interface represents an aspect that is owned.
 * @property {string} note - A short note about the aspect.
 * @property {string} time - The time when the aspect was owned.
 * @property {string} [note_long] - An optional longer note about the aspect.
 */
export interface OwnedAspect {
	note: string;
	time: string;
	note_long?: string;
}

/**
 * The OwnedAspects interface represents a collection of owned aspects.
 * The key is the name of the aspect and the value is an array of OwnedAspect.
 *
 * The OwnedAspect type represents an individual aspect that is owned. It includes properties such as
 * 'name', 'value', 'owner', etc. (Replace with actual properties of OwnedAspect)
 *
 * This structure allows for efficient lookup and manipulation of owned aspects in the collection.
 */
export interface OwnedAspects {
	[name: string]: OwnedAspect[];
}

/**
 * OwnedAspectFlat interface represents an aspect that is owned. Includes name as one of the properties at the same level as the others.
 */
export interface OwnedAspectFlat {
	name: string;
	note: string;
	time: string;
	note_long?: string;
}

/**
 * An array of OwnedAspectFlat objects.
 */
export type OwnedAspectFlatArray = OwnedAspectFlat[];
export type OwnedAspectArray = [string, OwnedAspect[]][];

export interface LocalizedText {
	deDE: string;
	esES: string;
	esMX: string;
	frFR: string;
	itIT: string;
	jaJP: string;
	koKR: string;
	plPL: string;
	ptBR: string;
	ruRU: string;
	trTR: string;
	zhCN: string;
	zhTW: string;
	enUS: string;
}

export interface AspectDetail {
	category: string;
	in_codex: boolean;
	class: string;
	name_localized: LocalizedText;
	desc_localized: LocalizedText;
}

export interface AspectDetails {
	[name: string]: AspectDetail[];
}

export type AspectDetailArray = [string, AspectDetail[]][];

/**
 * AspectData interface represents data about various aspects.
 * The key is the name of the aspect and the value is an object containing various properties about the aspect.
 * @property {string} category - The category of the aspect.
 * @property {boolean} in_codex - Whether the aspect is in the codex.
 * @property {string} class - The class of the aspect.
 * @property {Object} name_localized - The localized names of the aspect. The key is the language code and the value is the name in that language.
 * @property {Object} desc_localized - The localized descriptions of the aspect. The key is the language code and the value is the description in that language.
 */
export interface AspectData {
	[name: string]: {
		category: string;
		in_codex: boolean;
		class: string;
		name_localized: { [lang: string]: string };
		desc_localized: { [lang: string]: string };
	}[];
}

export interface AspectDta {
	category: string;
	in_codex: boolean;
	class: string;
	name_localized: { [lang: string]: string };
	desc_localized: { [lang: string]: string };
}

/**
 * Represents a debug entry.
 */
export interface DebugEntry {
	label: string;
	enabled: boolean;
	text: string;
}

// DebugArray type definition using an array of DebugEntry
export type DebugArray = DebugEntry[];

/**
 * Represents debug data as an array of DebugEntry objects.
 */
export interface DebugData {
	[index: number]: DebugEntry;
}

/**
   * Interface representing the details of an aspect.
   
  export interface AspectDetails {
    category: string;
    desc: string;
    in_codex: boolean;
    class: string;
  }
  */
/**
 * ItemType is a type that represents the type of an item.
 * It can be 'AMULET', '2H-WEAPON', or 'OTHER'.
 */
export type ItemType = "AMULET" | "2H-WEAPON" | "OTHER";

export interface AspectDete {
	category: string;
	in_codex: boolean;
	class: string;
	name_localized: { [lang: string]: string };
	desc_localized: TestDescLocalized;
}

export interface TestDescLocalized {
	[lang: string]: string;
}

export interface Namelocalized {
	deDE: string;
	esES: string;
	esMX: string;
	frFR: string;
	itIT: string;
	jaJP: string;
	koKR: string;
	plPL: string;
	ptBR: string;
	ruRU: string;
	trTR: string;
	zhCN: string;
	zhTW: string;
	enUS: string;
}

/**
 * An object containing multiple AspectDete objects, indexed by name.
 */
export interface AspectDetes {
	[name: string]: AspectDete;
}

export interface AspectFlat {
	name: string;
	category: string;
	in_codex: boolean;
	class: string;
	name_localized: { [lang: string]: string };
	desc_localized: { [lang: string]: string };
}

export type AspectFlatArray = AspectFlat[];

export type AspectDeteArray = [string, AspectDete][];
