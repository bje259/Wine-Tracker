<script lang="ts">
	import { showAspectStore, showSlotBasedViewStore, slotFilterStore } from "../store";
	/** eslint-disable svelte/no-at-html-tags */
	import type { AspectFlat, OwnedAspect } from "$types";
	//import { OwnedAspectsClass } from '$lib';
	import { createEventDispatcher } from "svelte";
	import { debugArray, newOwnedAspects } from "../store";
	import AddOwned from "./AddOwned.svelte";
	import ListOwned from "./ListOwned.svelte";
	//import { writable } from "svelte/store";
	//import App from '../App.svelte';
	const dispatch = createEventDispatcher();

	export let aspect: AspectFlat;
	export let selectedLocalization = "";
	export let aspectSlot: string;
	let showAspect: boolean = true;
	//let showAspect = writable("true");
	/*const unsubscribe = showAspectStore.subscribe((value) => {
		showAspect = value;
	});*/

	$: if (!$showSlotBasedViewStore) {
		aspectSlot = "";
	}

	$: ownedAspects = $newOwnedAspects.getAspectsByName(aspect.name) || [];
	//ownedAspects = [aspect.name,$newOwnedAspects.getAspectsByName(aspect.name)];
	//ownedAspects[aspect.name] = $newOwnedAspects.getAspectsByName(aspect.name);
	let ownAspectDetails: OwnedAspect[] = [];
	$: {
		ownAspectDetails = $newOwnedAspects.getAspectsByName(aspect.name) || [];
		//ownAspectDetails = (JSON.parse(localStorage.getItem(aspect.name)) as OwnedAspect[]) || [];
	}

	/*function updateDebugArray(pLabel: string, pEnabled: boolean, pText: string) {
		debugArray.update((currentArray) => [
			...currentArray,
			{
				label: pLabel,
				enabled: pEnabled,
				text: pText
			}
		]);
	}*/
	debugArray.subscribe((currentArray) => {
		currentArray.forEach((entry) => {
			if (entry.enabled) {
				console.log(`[${entry.label}]: ${entry.text}`);
			}
		});
	});
	function chkOwnedAspectsBySlot(slotFilter: string): boolean {
		return (
			!(ownedAspects === undefined) &&
			ownedAspects.filter((aspect) => {
				aspect.note.toLowerCase().includes(slotFilter.toLowerCase());
			}).length > 0
		);
	}
	function formatText(text: string): string {
		const regex = /([x+]?){([^}]+)}(%?)/g;
		const matches: RegExpMatchArray[] = Array.from(text.matchAll(regex));

		let replace: string = text;

		for (const match of matches) {
			const [keyword, x, range, percent]: string[] = match;
			const stats: string = `<span class="text-blue-500 whitespace-nowrap">${x}[${range?.replace(
				"/",
				"-"
			)}]${percent}</span>`;
			replace = replace.replace(keyword, stats);
		}
		return replace;
	}

	function handleAspectUpdated() {
		let storedValue = localStorage.getItem(aspect.name) ?? "[]";
		try {
			ownedAspects = JSON.parse(storedValue);
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			ownedAspects = [];
		}
		console.log(`ZZ Aspect handleAspectUpdated - ownedAspects: ${ownedAspects}`);
		newOwnedAspects.update((current) => {
			current.updateOwnedAspectsByName(aspect.name, ownedAspects);
			return current;
		});
		dispatch("aspectUpdated");
	}

	function standardize(name: string): string {
		//check the first character of the name.  if it is a [
		//then it is a localized name and we need to remove the [ and ]
		if (name[0] === "[") {
			return name.split("]")[1].split("[")[0];
		} else {
			return name;
		}
	}

	$: {
		showAspect = $showAspectStore;
		console.log(`ZZ Aspect showAspect: ${showAspect}`);
	}
	function showSelf(): boolean {
		//updateDebugArray('showSelfName', true, 'aspect.name: ' + aspect.name)
		//updateDebugArray('showselfSlotFilterStore', true, 'slotFilterStore: ' + $slotFilterStore)
		console.log(`ZZ Aspect showSelf - aspectSlot is: ${aspectSlot}
		aspect.name is: ${aspect.name}
		$showSlotBasedViewStore is: ${$showSlotBasedViewStore}
		$slotFilterStore is: ${$slotFilterStore}
		ownedAspectDetails is: ${ownAspectDetails} `);
		$showAspectStore =
			!(ownAspectDetails === undefined || ownAspectDetails === null) && ownAspectDetails.length > 0;
		return $showAspectStore;
		//return chkOwnedAspectsBySlot($slotFilterStore);
	}
	//$showAspectStore = showSelf(); //!(ownAspectDetails === undefined || ownAspectDetails === null) && ownAspectDetails.length > 0;
	$: console.log(`showAspectStore reactive statement: ${$showAspectStore}`);
</script>

<div class="mb-8 flex flex-col">
	<h3 class="text-lg font-medium mb-2 text-amber-600">
		{standardize(aspect.name_localized[selectedLocalization])}, {aspect.category}
		{aspect.in_codex ? "(Codex)" : ""}
	</h3>
	<p class="text-base mb-4 flex-grow">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html formatText(aspect.desc_localized[selectedLocalization])}
	</p>

	{#if $showAspectStore}
		<ListOwned
			aspectName={aspect.name}
			ownedAspects={ownAspectDetails}
			{aspectSlot}
			on:aspectUpdated={handleAspectUpdated}
		/>
	{/if}
	<AddOwned
		aspectName={aspect.name}
		aspectCategory={aspect.category}
		{ownedAspects}
		on:aspectUpdated={handleAspectUpdated}
	/>
</div>
