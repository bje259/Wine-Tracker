import type { OwnedAspectFlatArray } from "../lib/types";
import type { Writable } from "svelte/store";
import { describe, expect, it } from "vitest";
import { OwnedAspectsClass } from "../lib/OwnedAspectsClass";
import { filterAspects } from "../lib/filterAspects";
import { newOwnedAspects } from "../store";
const ownedAspectsStore: Writable<OwnedAspectsClass> = newOwnedAspects;
let ownedAspects: OwnedAspectsClass;
const unsubscribe = ownedAspectsStore.subscribe((value) => {
	ownedAspects = value;
});

describe("filterAspects", () => {
	const aspects = [
		{
			name: "Aspect 1",
			category: "Defensive",
			class: "Class A",
			in_codex: true,
			name_localized: {
				"en-US": "Aspect 1",
				"es-ES": "Aspecto 1"
			},
			desc_localized: {
				"en-US": "This is Aspect 1",
				"es-ES": "Este es Aspecto 1"
			}
		},
		{
			name: "Aspect 2",
			category: "Offensive",
			class: "Class B",
			in_codex: false,
			name_localized: {
				"en-US": "Aspect 2",
				"es-ES": "Aspecto 2"
			},
			desc_localized: {
				"en-US": "This is Aspect 2",
				"es-ES": "Este es Aspecto 2"
			}
		},
		{
			name: "Aspect 3",
			category: "Utility",
			class: "Class C",
			in_codex: true,
			name_localized: {
				"en-US": "Aspect 3",
				"es-ES": "Aspecto 3"
			},
			desc_localized: {
				"en-US": "This is Aspect 3",
				"es-ES": "Este es Aspecto 3"
			}
		}
	];

	it("should return all aspects when no filters are applied", () => {
		filterAspects(aspects, "", "", "", false, "", false, "", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		expect(filteredAspects).toEqual(aspects);
	});

	it("should filter aspects by selected class", () => {
		filterAspects(aspects, "Class A", "", "", false, "", false, "", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		expect(filteredAspects).toEqual([aspects[0]]);
	});

	it("should filter aspects by search term", () => {
		filterAspects(aspects, "", "Aspect 1", "", false, "", false, "", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		expect(filteredAspects).toEqual([aspects[0]]);
	});

	it("should filter aspects by selected codex", () => {
		filterAspects(aspects, "", "", "true", false, "", false, "", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		expect(filteredAspects).toEqual([aspects[0], aspects[2]]);
	});

	it("should filter aspects by owned status", () => {
		//add aspects to ownedAspects as a flat array
		const ownedAspectsArray: OwnedAspectFlatArray = [];
		ownedAspectsArray.push({
			name: "Aspect 1",
			note: "154/461, 2H-Weapon: (307)/(922)",
			time: "10/30/2023, 6:20:52 AM",
			note_long: "LVL26"
		});
		ownedAspectsArray.push({
			name: "Aspect 3",
			note: "154/461, 2H-Weapon: (307)/(922)",
			time: "10/30/2023, 6:20:52 AM",
			note_long: "LVL26"
		});
		ownedAspects.addAspectsFlatArray(ownedAspectsArray);
		filterAspects(aspects, "", "", "", true, "", false, "", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		expect(filteredAspects).toEqual([aspects[0], aspects[2]]);
	});

	it("should filter aspects by selected slot", () => {
		filterAspects(aspects, "", "", "", false, "Chest", false, "", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		expect(filteredAspects).toEqual([aspects[0], aspects[2]]);
	});

	it("should filter aspects by slot filter store", () => {
		filterAspects(aspects, "", "", "", false, "", true, "Weapon", "en-US");
		const filteredAspects = ownedAspects.getFilteredAspectFlatArray();
		console.log("filteredAspects: " + JSON.stringify(filteredAspects));
		expect(filteredAspects.includes(aspects[2])).toBe(true);
		//expect((filteredAspects.includes(aspects[0])||filteredAspects.includes(aspects[2]))).toBe(true)
	});
});
