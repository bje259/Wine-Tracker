import type { AspectFlatArray, OwnedAspect } from "$types";
import type { Writable } from "svelte/store";
import { newOwnedAspects } from "../store";
import { OwnedAspectsClass } from "./OwnedAspectsClass";
const ownedAspectsStore: Writable<OwnedAspectsClass> = newOwnedAspects;
let ownedAspects: OwnedAspectsClass;

export function filterAspects(
	aspects: AspectFlatArray,
	selectedClass: string,
	searchTerm: string,
	selectedCodex: string,
	limitToOwned: boolean,
	selectedSlot: string,
	slotBasedViewStore: boolean,
	slotFilter: string,
	selectedLocalization: string
): void {
	const unsubscribe = ownedAspectsStore.subscribe((value) => {
		ownedAspects = value;
	});

	//print received aspects
	const aspectNames = aspects.map((aspect) => {
		return aspect.name;
	});
	console.log("Filter function received aspectNames: ", aspectNames.length);
	let filteredCount = 0;
	let unfilteredCount = 0;
	let countArray: [string, number, number][] = [];
	let currentCheck = "";

	function nextCount(check: string) {
		if (currentCheck === "") {
			currentCheck = check;
			return;
		}
		if (currentCheck === check) {
			return;
		}
		countArray.push([currentCheck, filteredCount, unfilteredCount]);
		currentCheck = check;
		filteredCount = 0;
		unfilteredCount = 0;
	}

	let tmpAspects: AspectFlatArray = [];
	tmpAspects = aspects
		.filter((aspect) => {
			nextCount("limitToOwned check");
			if (limitToOwned) {
				//console.log("limitToOwned is true");
				/*console.log(
					"ownedAspects.getAspectsByName(aspect.name) is " +
						(ownedAspects.getAspectsByName(aspect.name) !== undefined)
				);*/
				if (ownedAspects.getAspectsByName(aspect.name) !== undefined) {
					unfilteredCount++;
					return true;
				} else {
					filteredCount++;
					return false;
				}
				//return ownedAspects.getAspectsByName(aspect.name) !== undefined;
			}
			// console.log("limitToOwned is false");
			unfilteredCount++;
			return true;
		})
		.filter((aspect) => {
			//console.log("Beginning check for slot if showSlotBasedViewStore is true");

			if (!slotBasedViewStore) {
				//console.log("showSlotBasedViewStore is false");
				return true;
			} else {
				nextCount("showSlotBasedViewStore check");
				let namedAspects: OwnedAspect[] = [];
				if (ownedAspects.getAspectsByName(aspect.name) === undefined) {
					namedAspects = [{ note: "Not Found", time: "", note_long: "" }];
				} else {
					namedAspects = ownedAspects.getAspectsByName(aspect.name) || [];
				}
				console.log(
					"aspect name is: " +
						aspect.name +
						"\nOwnedAspects are :\n" +
						namedAspects
							.map((aspect) => {
								return aspect.note;
							})
							.join("\n")
				);
				if (ownedAspects.chkOwnedAspectsBySlotNameMatch(slotFilter, aspect.name)) {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			}
			/*($slotFilterStore === '') {
        console.log('slotFilterStore is empty')
        return true
      } else if ($slotFilterStore === 'Helmet') {
        console.log('slotFilterStore is Helmet')
        return aspect.category === 'Defensive' || aspect.category === 'Utility'
      } else if ($slotFilterStore === 'Chest') {
        console.log('slotFilterStore is Chest')
        return aspect.category === 'Defensive' || aspect.category === 'Utility'
      } else if ($slotFilterStore === 'Gloves') {
        console.log('slotFilterStore is Gloves')
        return aspect.category === 'Offensive' || aspect.category === 'Utility'
      } else if ($slotFilterStore === 'Pants') {
        console.log('slotFilterStore is Pants')
        return aspect.category === 'Defensive'
      } else if ($slotFilterStore === 'Boots') {
        console.log('slotFilterStore is Boots')
        return aspect.category === 'Utility' || aspect.category === 'Mobility'
      } else if (
        $slotFilterStore === 'Weapon' ||
        aspect.category === 'Offhand'
      ) {
        console.log('slotFilterStore is Weapon or Offhand')
        return aspect.category === 'Offensive' || aspect.category === 'Weapon'
      } else if ($slotFilterStore === 'Amulet') {
        console.log('slotFilterStore is Amulet')
        return (
          aspect.category === 'Defensive' ||
          aspect.category === 'Offensive' ||
          aspect.category === 'Utility' ||
          aspect.category === 'Mobility'
        )
      } else if ($slotFilterStore === 'Ring') {
        console.log('slotFilterStore is Ring')
        return aspect.category === 'Offensive' || aspect.category === 'Resource'
      } else if ($slotFilterStore === 'Shield') {
        console.log('slotFilterStore is Shield')
        return aspect.category === 'Defensive' || aspect.category === 'Utility'
      } else {
        console.log('slotFilterStore is ' + $slotFilterStore)
        return false
      }*/
		})
		.filter((aspect) => {
			nextCount("selectedClass check");
			//console.log("aspect is " + aspect.name);
			if (selectedClass === "") {
				//console.log("selectedClass is empty");
				unfilteredCount++;
				return true;
			} else if (selectedClass === "All Classes") {
				//console.log("selectedClass is All Classes");
				unfilteredCount++;
				return true;
			} else {
				/*console.log(
          "selectedClass is " +
            selectedClass +
            " and aspect.class is " +
            aspect.class,
        );*/
				if (aspect.class === selectedClass || aspect.class === "Generic") {
					unfilteredCount++;
					return true;
				} else {
					filteredCount++;
					return false;
				}
			}
		})
		.filter((aspect) => {
			nextCount("searchTerm check");
			if (searchTerm === "") {
				//console.log("searchTerm is empty");
				unfilteredCount++;
				return true;
			}
			let hyphenateLocalization = "";
			if (selectedLocalization.length === 4) {
				const languageCode = selectedLocalization.substring(0, 2);
				const countryCode = selectedLocalization.substring(2);
				hyphenateLocalization = languageCode + "-" + countryCode;
			} else hyphenateLocalization = "en-US";

			const lowercaseInput = searchTerm.normalize("NFC").toLocaleLowerCase(hyphenateLocalization);
			const lowercaseName = aspect.name_localized[selectedLocalization]
				.normalize("NFC")
				.toLocaleLowerCase(hyphenateLocalization);
			const lowercaseDesc = aspect.desc_localized[selectedLocalization]
				.normalize("NFC")
				.toLocaleLowerCase(hyphenateLocalization);
			//console.log("lowercaseInput: ", lowercaseInput);
			//console.log("lowercaseName: ", lowercaseName);
			//console.log("lowercaseDesc: ", lowercaseDesc);
			if (lowercaseName.includes(lowercaseInput) || lowercaseDesc.includes(lowercaseInput)) {
				unfilteredCount++;
				return true;
			}
			filteredCount++;
			return false;
		})
		.filter((aspect) => {
			nextCount("selectedCodex check");
			if (selectedCodex === "") {
				//console.log("selectedCodex is empty");
				unfilteredCount++;
				return true;
			} else if (selectedCodex === "false") {
				//console.log("selectedCodex is false");
				//console.log("aspect.in_codex is " + aspect.in_codex);

				if (!aspect.in_codex) {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedCodex === "true") {
				// console.log("selectedCodex is true");
				//console.log("aspect.in_codex is " + aspect.in_codex);
				if (aspect.in_codex) {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			}
		})
		.filter((aspect) => {
			nextCount("selectedSlot check");
			if (selectedSlot === "") {
				// console.log("selectedSlot is empty");
				unfilteredCount++;
				return true;
			} else if (selectedSlot === "Helmet") {
				// console.log("selectedSlot is Helmet looking for Defensive or Utility");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Defensive" || aspect.category === "Utility") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Chest") {
				// console.log("selectedSlot is Chest looking for Defensive or Utility");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Defensive" || aspect.category === "Utility") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Gloves") {
				// console.log("selectedSlot is Gloves looking for Offensive or Utility");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Offensive" || aspect.category === "Utility") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Pants") {
				// console.log("selectedSlot is Pants looking for Defensive");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Defensive") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Boots") {
				// console.log("selectedSlot is Boots looking for Utility or Mobility");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Utility" || aspect.category === "Mobility") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Weapon" || aspect.category === "Offhand") {
				// console.log(
				//   "selectedSlot is Weapon or Offhand looking for Offensive or Weapon",
				// );
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Offensive" || aspect.category === "Weapon") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Amulet") {
				// console.log(
				//   "selectedSlot is Amulet looking for Defensive, Offensive, Utility, or Mobility",
				// );
				// console.log("aspect.category is " + aspect.category);
				if (
					aspect.category === "Defensive" ||
					aspect.category === "Offensive" ||
					aspect.category === "Utility" ||
					aspect.category === "Mobility"
				) {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Ring") {
				// console.log("selectedSlot is Ring looking for Offensive or Resource");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Offensive" || aspect.category === "Resource") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else if (selectedSlot === "Shield") {
				// console.log("selectedSlot is Shield looking for Defensive or Utility");
				// console.log("aspect.category is " + aspect.category);
				if (aspect.category === "Defensive" || aspect.category === "Utility") {
					unfilteredCount++;
					return true;
				}
				filteredCount++;
				return false;
			} else {
				// console.log("selectedSlot is " + selectedSlot);
				filteredCount++;
				return false;
			}
		})
		.sort((a, b) => {
			const regex = /^of the |^of /i;
			const nameA = a.name.replace(regex, "").toLowerCase();
			const nameB = b.name.replace(regex, "").toLowerCase();
			if (nameA < nameB) {
				return -1; // a should come before b in the sorted order
			}
			if (nameA > nameB) {
				return 1; // a should come after b in the sorted order
			}
			return 0; // a and b are equal in terms of sorting
		});
	//report out the names of the tmpAspects
	const tmpAspectNames = tmpAspects.map((aspect) => {
		return aspect.name;
	});
	console.log("Filtere finishing with this many: ", tmpAspectNames.length);

	//report out the counts from the array
	countArray.push(["selectedSlot check", filteredCount, unfilteredCount]);
	if (false) {		
		countArray.forEach((count) => {
			console.log(count[0] + " filteredCount: ", count[1]);
			console.log(count[0] + " unfilteredCount: ", count[2]);
		});
	}

	//update the ownedAspects store with the filtered aspects
	ownedAspectsStore.update((current) => {
		current.updateFilteredAspectFlatArray(tmpAspects);
		return current;
	});
	unsubscribe();
	//return aspects
}
