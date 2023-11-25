<script lang="ts">
	import type { OwnedAspect } from "$types";
	import { Button } from "flowbite-svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { newOwnedAspects, slotFilterStore } from "../store";

	export let aspectName: string;
	export let ownedAspects: OwnedAspect[];
	export let aspectSlot: string;
	console.log("ownedAspects", ownedAspects);
	console.log("aspectName", aspectName);
	let aspects: OwnedAspect[] = [];
	let filteredAspects: OwnedAspect[] = [];

	const dispatch = createEventDispatcher();

	console.log(`AspectSlot ${aspectSlot}`);
	$: {
		if (aspectSlot !== "" && aspectSlot !== undefined) {
			filteredAspects = ownedAspects.filter((ownedAspect) => {
				return ownedAspect.note.toLowerCase().includes(aspectSlot.toLowerCase());
			});
		} else {
			filteredAspects = ownedAspects;
		}
		console.log(
			`List Aspects filterchk:		
		${filteredAspects.map((a) => a.note).join(", ")} 
		for ` + $slotFilterStore.toLowerCase()
		);
	}
	function showingItem(note: string): string {
		console.log(`ZZ ListOwned - Aspect is ${aspectName}
		showingItem: ${note}`);
		return note;
	}

	onMount(() => {});

	function deleteOwnedAspect(slotIndex: number) {
		console.log(`ZZ Deletion attempt - Aspect is ${aspectName}
		deleteOwnedAspect: ${slotIndex}
		Slot is ${aspectSlot}
		OwnedAspectClass getOwnedAspectsBySlotNameMatch:`);
		console.log($newOwnedAspects.getOwnedAspectsBySlotNameMatch(aspectSlot, aspectName));
		console.log("getOwnedAspectsByName:");
		console.log($newOwnedAspects.getAspectsByName(aspectName));

		const index = $newOwnedAspects.getOwnedAspectsIndexBySlotNameMatch(
			aspectSlot,
			aspectName,
			slotIndex
		);
		console.log(`Global index is ${index}`);
		if (index >= 0) {
			const ownedAspectData = localStorage.getItem(aspectName) ?? "[]";
			try {
				aspects = JSON.parse(ownedAspectData) as OwnedAspect[];

				//let ownedAspectList = $newOwnedAspects.convertDataToArray<OwnedAspect>(aspects);
				//ownedAspectList.splice(index, 1);
				aspects.splice(index, 1);
				if (aspects.length === 0) {
					localStorage.removeItem(aspectName);
				} else {
					localStorage.setItem(aspectName, JSON.stringify(aspects));
				}
				$newOwnedAspects.updateOwnedAspectsByName(aspectName, aspects);

				dispatch("aspectUpdated");
			} catch (error) {
				console.log("Error parsing ownedAspectData", error);
				aspects = [];
			}
		} else {
			console.log(`error - index is ${index}`);
		}
	}
</script>

<div class="mb-4 grid grid-cols-2 gap-4">
	{#each filteredAspects as ownedAspect, index}
		<div class="p-1 md:p-2 flex items-center">
			<div class="flex flex-col">
				<div class="text-xl mb-2">{showingItem(ownedAspect.note)}</div>
				<div class="text-sm">{ownedAspect.note_long || ""}</div>
			</div>
			<Button class="ml-auto" color="red" outline on:click={() => deleteOwnedAspect(index)}>
				X
			</Button>
		</div>
	{/each}
</div>
