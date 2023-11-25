<script lang="ts">
	import type { AspectFlatArray } from "$types";
	//imports
	import {
		Banner,
		Button,
		Checkbox,
		CloseButton,
		Input,
		Modal,
		Select,
		Spinner,
		Textarea
	} from "flowbite-svelte";
	import { onMount } from "svelte";
	import { Hamburger } from "svelte-hamburgers";
	import Aspect from "./lib/Aspect.svelte";
	import { filterAspects } from "./lib/filterAspects.js";
	import type {
		//AspectData,
		AspectDeteArray,
		AspectDetes,
		//AspectDta,
		OwnedAspect,
		OwnedAspects
	} from "./lib/types";
	import { debugArray, newOwnedAspects, showSlotBasedViewStore, slotFilterStore } from "./store.js";

	//declarations
	let classes = [
		{ value: "", name: "All Classes" },
		{ value: "Barbarian", name: "Barbarian" },
		{ value: "Druid", name: "Druid" },
		{ value: "Necromancer", name: "Necromancer" },
		{ value: "Rogue", name: "Rogue" },
		{ value: "Sorcerer", name: "Sorcerer" }
	];
	let codex = [
		{ value: "", name: "All Aspects" },
		{ value: "true", name: "In Codex" },
		{ value: "false", name: "Not In Codex" }
	];
	// "Defensive": "Amulet [+50%], Chest, Helmet, Pants, Shield.",
	// 	"Offensive": "Amulet [+50%], Gloves, Ring, 1H Weapon, 2H Weapon [+100%].",
	// 	"Utility": "Amulet [+50%], Boots, Chest, Gloves, Helmet, Shield.",
	// 	"Resource": "Ring.",
	// 	"Mobility": "Amulet [+50%], Boots.",
	//  "Weapon": "1H Weapon, 2H Weapon [+100%].",
	let slots = [
		{ value: "", name: "All Slots" },
		{ value: "Helmet", name: "Helmet" },
		{ value: "Chest", name: "Chest" },
		{ value: "Gloves", name: "Gloves" },
		{ value: "Pants", name: "Pants" },
		{ value: "Boots", name: "Boots" },
		{ value: "Weapon", name: "Weapon" },
		{ value: "Offhand", name: "Offhand" },
		{ value: "Amulet", name: "Amulet" },
		{ value: "Ring", name: "Ring" },
		{ value: "Shield", name: "Shield" }
	];
	let realSlots = [
		{ value: "Helmet", name: "Helmet" },
		{ value: "Chest", name: "Chest" },
		{ value: "Gloves", name: "Gloves" },
		{ value: "Pants", name: "Pants" },
		{ value: "Boots", name: "Boots" },
		{ value: "Weapon", name: "Weapon" },
		{ value: "Offhand", name: "Offhand" },
		{ value: "Amulet", name: "Amulet" },
		{ value: "Ring", name: "Ring" },
		{ value: "Shield", name: "Shield" }
	];
	let open = false;
	console.log("First updateOwnedAspects");
	$newOwnedAspects.updateOwnedAspects(loadOwnedAspectsFromLocalStorage());
	let browserLanguage = navigator.language.replace("-", "");
	let selectedLocalization = localStorage.getItem("_localization") || "";

	let supportedLocalizations = [
		{ value: "enUS", name: "USA" },
		{ value: "deDE", name: "Germany" },
		{ value: "esES", name: "Spain" },
		{ value: "esMX", name: "Mexico" },
		{ value: "frFR", name: "France" },
		{ value: "itIT", name: "Italy" },
		{ value: "jaJP", name: "Japan" },
		{ value: "koKR", name: "Korea" },
		{ value: "plPL", name: "Poland" },
		{ value: "ptBR", name: "Brazil" },
		{ value: "trTR", name: "Turkey" },
		{ value: "zhTW", name: "Taiwan" }
	];
	//let currentSlotFilter = ' '
	let aspects: AspectFlatArray = [];
	let selectedClass = "";
	let searchTerm = "";
	let selectedSlot = "";
	let limitToOwned = false;
	let selectedCodex = "";
	let ownedAspectsString = "";
	let importAspectsString = "";
	//let filteredSlot = ''
	let importModal = false;
	let exportModal = false;
	let filteredAspects: AspectFlatArray = [];
	let slotFilteredAspects: { [slot: string]: AspectFlatArray } = {};
	let showSection: { [section: string]: boolean } = {};
	//let aspect: AspectDeteArray = []
	//Functions

	// Function overloads
	function getAspectNames(aspectData: AspectDetes): string[];
	function getAspectNames(aspectData: AspectDeteArray): string[];
	function getAspectNames(aspectData: AspectFlatArray): string[];

	// Implementation
	function getAspectNames(aspectData: AspectDetes | AspectDeteArray | AspectFlatArray): string[] {
		if (Array.isArray(aspectData)) {
			// Check if the first element is a tuple (AspectDeteArray)
			if (aspectData.length > 0 && Array.isArray(aspectData[0])) {
				//updateDebugArray('getAspectNamesChk', true, 'aspectData is an AspectDeteArray');
				return (aspectData as AspectDeteArray).map(([name]) => name);
			} else {
				// It's an AspectFlatArray
				// updateDebugArray('getAspectNamesChk', true, 'aspectData is an AspectFlatArray');
				return (aspectData as AspectFlatArray).map((entry) => entry.name);
			}
		} else {
			// Handle the AspectDetes case
			//updateDebugArray('getAspectNamesChk', true, 'aspectData is an object');
			return Object.keys(aspectData);
		}
	}
	//updates the debug array
	function toggleDebug(label: string) {
		debugArray.update((currentArray) => {
			// Find the index of the debug entry with the matching label
			const index = currentArray.findIndex((entry) => entry.label === label);
			if (index !== -1) {
				// Toggle the 'enabled' property
				const entry = currentArray[index];
				entry.enabled = !entry.enabled;
				// Replace the entry in the array
				return [...currentArray.slice(0, index), entry, ...currentArray.slice(index + 1)];
			}
			return currentArray; // If not found, return the array unchanged
		});
	}
	//setup watch points for debugging using reactive statements
	function updateDebugArray(pLabel: string, pEnabled: boolean, pText: string) {
		debugArray.update((currentArray) => [
			...currentArray,
			{
				label: pLabel,
				enabled: pEnabled,
				text: pText
			}
		]);
	}
	/**
	 * Fetches aspects data from the server and maps it to an array of objects.
	 * @returns {Promise<void>}
	 */
	async function getAspects() {
		const aspects_db_url = "/aspects.json";

		try {
			const response = await fetch(aspects_db_url);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data: AspectDetes = (await response.json()) as AspectDetes;
			updateDebugArray("getAspects1", false, getAspectNames(data).join(" "));
			// Check if the response is valid JSON
			if (typeof data !== "object") {
				throw new Error("Invalid JSON format!");
			}

			aspects = Object.entries(data).map(([name, aspect]) => ({
				name: name,
				...aspect
			}));
		} catch (error) {
			console.error(error);
		}
	}
	function setLocalization() {
		localStorage.setItem("_localization", selectedLocalization);
	}
	function loadOwnedAspectsFromLocalStorage(): OwnedAspects {
		const loadedOwnedAspects: OwnedAspects = {};

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) {
				if (key.indexOf("_") === 0) {
					continue;
				}
				const values = localStorage.getItem(key);
				console.log("loadfromstorage key " + key);
				if (values) {
					try {
						loadedOwnedAspects[key] = JSON.parse(values) as OwnedAspect[];
					} catch (error) {
						console.error(`Error parsing data for key "${key}":`, error);
					}
				}
			}
		}

		return loadedOwnedAspects;
	}
	function handleAspectUpdated() {
		// Update the local data or trigger a refresh
		console.log("handleAspectUpdated called loading from local storage");
		$newOwnedAspects.updateOwnedAspects(loadOwnedAspectsFromLocalStorage());
	}

	function clearSearch(e: MouseEvent): void {
		searchTerm = "";
	}

	function importData(e: MouseEvent): void {
		if (importAspectsString === "") {
			return;
		}
		const importAspects: OwnedAspects = JSON.parse(importAspectsString) as OwnedAspects;

		// Save owned aspects to local storage
		for (const key in importAspects) {
			const values = importAspects[key];
			localStorage.setItem(key, JSON.stringify(values));
		}

		importAspectsString = "";
		importModal = false;
	}

	function copyText(e: MouseEvent): void {
		navigator.clipboard
			.writeText(ownedAspectsString)
			.then(() => {
				alert("Copied Aspects to Clipboard");
			})
			.catch(() => {
				alert("something went wrong");
			});
	}

	//$newOwnedAspects.updateOwnedAspects(loadOwnedAspectsFromLocalStorage());

	function updateFilteredAspects(slot: string): string {
		if (slot == "" || slot == undefined || slot == "none") {
			console.log("ZZ App showing Aspect - updateFilteredAspects: All Slots");
			return "All Slots";
		} else {
			console.log("ZZ App showing updateFilteredAspects: " + slot);
			$slotFilterStore = slot;

			return slot;
		}
	}

	//prints debug array to console
	debugArray.subscribe((currentArray) => {
		currentArray.forEach((entry) => {
			if (entry.enabled) {
				console.log(`[${entry.label}]: ${entry.text}`);
			}
		});
	});
	//checks localizations selection
	if (selectedLocalization == null || selectedLocalization == "") {
		if (supportedLocalizations.find((x) => x.value === browserLanguage)) {
			selectedLocalization = browserLanguage;
		} else {
			selectedLocalization = "enUS";
		}
		localStorage.setItem("_localization", selectedLocalization);
	}

	$: if (!$showSlotBasedViewStore) {
		$slotFilterStore = "";
	}

	//checks if slot based view is selected
	$: {
		if ($showSlotBasedViewStore) {
			slotFilteredAspects = realSlots.reduce((acc: { [key: string]: AspectFlatArray }, slot) => {
				console.log("Code reactive: SlotView=ON Loop=Real slots " + slot.value);
				filterAspects(
					aspects,
					selectedClass,
					searchTerm,
					selectedCodex,
					limitToOwned,
					selectedSlot,
					true,
					slot.value,
					selectedLocalization
				);
				acc[slot.value] = $newOwnedAspects.getFilteredAspectFlatArray();
				showSection[slot.value] = acc[slot.value].length > 0;
				return acc;
			}, {});

			let filteredString: string = Object.entries(slotFilteredAspects)
				.map(([slot, aspects]) => `${slot}: ${aspects.map((a) => a.name).join(", ")}`)
				.join("\n");
			console.log("Code reactive: SlotView=ON: Loop=done Filtered entries: " + filteredString);
		} else {
			filterAspects(
				aspects,
				selectedClass,
				searchTerm,
				selectedCodex,
				limitToOwned,
				selectedSlot,
				false,
				"",
				selectedLocalization
			);
			filteredAspects = $newOwnedAspects.getFilteredAspectFlatArray();
			console.log(
				"Code reactive: SlotView=Off Loop=off Filtered count = " + filteredAspects.length
			);
		}
	}
	$: filteredAspects = $newOwnedAspects.getFilteredAspectFlatArray();
	// Load owned aspects from local storage on component mount
	onMount(() => {
		getAspects().catch((error) => {
			console.error("An error occurred while fetching aspects:", error);
		});
		// example ownedAspects
		// {
		//   "Abyssal": [{
		//     "note": "25%",
		//     "time": "2021-05-01T12:00:00"
		//   }, {
		//     "note": "50%",
		//     "time": "2021-05-02T12:00:00"
		//   }]
		// }

		localStorage.removeItem("localization");

		// Load owned aspects from local storage
		console.log("onMount called loading from local storage");
		$newOwnedAspects.updateOwnedAspects(loadOwnedAspectsFromLocalStorage());
	});

	$: if (exportModal) {
		ownedAspectsString = JSON.stringify(loadOwnedAspectsFromLocalStorage());
	}
</script>

<!--Markup section-->
<Banner id="top-banner" position="relative">
	<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
		<span class="inline-flex p-1 mr-3 bg-gray-200 rounded-full dark:bg-gray-600">
			<svg
				class="w-4 h-4 text-gray-500 dark:text-gray-400"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"
				/>
			</svg>
			<span class="sr-only">Issues and Comments</span>
		</span>
		<span
			><p>
				This project is open source. Please report issues, feedback, and comments on our <a
					href="https://github.com/fawadasaurus/d4-aspect-tracker/issues"
					class="inline font-medium text-primary-600 underline dark:text-primary-500 underline-offset-2 decoration-600 dark:decoration-500 decoration-solid hover:no-underline"
					>Github</a
				>
			</p>
			<!-- <p>
        Localization (language) and Export/Import in the menu on the top left.
      </p> -->
		</span>
		<span />
	</p>
</Banner>

<Modal title="Import Aspects" bind:open={importModal} autoclose>
	<Textarea bind:value={importAspectsString} />
	<Button on:click={importData}>Import</Button>
</Modal>

<Modal title="Export Aspects" bind:open={exportModal} autoclose>
	<Textarea bind:value={ownedAspectsString} readonly />
	<Button on:click={copyText}>Copy</Button>
</Modal>

<Hamburger --color="grey" bind:open />
{#if open}
	<Button on:click={() => (exportModal = true)}>Export</Button>
	<Button on:click={() => (importModal = true)}>Import</Button>
	<Select
		placeholder="Language"
		class="w-40 inline-block"
		items={supportedLocalizations}
		bind:value={selectedLocalization}
		on:change={setLocalization}
	/>
{/if}
<!--primary UI section including search input fields and heard aspect information -->
<div class="p-4">
	<div class="mb-8 md:max-w-md mx-auto">
		<h1 class="text-2xl text-red-600 font-medium mb-4">D4 Aspect Tracker</h1>
		<Input bind:value={searchTerm} placeholder="Search by name or description" class="mt-2">
			<CloseButton slot="right" on:click={clearSearch} />
		</Input>
		<Select placeholder="Select a class" class="mt-2" items={classes} bind:value={selectedClass} />
		<Select placeholder="Select item slot" class="mt-2" items={slots} bind:value={selectedSlot} />
		<Select
			placeholder="Both In Codex and Not in Codex"
			class="mt-2"
			items={codex}
			bind:value={selectedCodex}
		/>
		<div class="mt-2">
			<Checkbox class="text-base" name="lto" bind:checked={limitToOwned}>Limit to owned</Checkbox>
		</div>

		{#if limitToOwned}<!--new checkbox for new sorting method; only shows if the original check box is checked-->
			<div class="flex items-center mb-4">
				<input
					id="sbv"
					type="checkbox"
					value=""
					bind:checked={$showSlotBasedViewStore}
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
				/>
				<label for="sbv" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Show Slot Based View</label
				>
			</div>
		{/if}
	</div>
	{#if $showSlotBasedViewStore}
		{#each realSlots as slot (slot.value)}
			{#if showSection[slot.value]}
				<div class="mb-8 flex flex-col">
					<h1 class="text-2xl text-red-600 font-medium mb-4">
						{slot.name}
					</h1>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#if slotFilteredAspects[slot.value].length > 0}
							{#each slotFilteredAspects[slot.value] as aspect (aspect.name)}
								<Aspect
									{aspect}
									{selectedLocalization}
									aspectSlot={updateFilteredAspects(slot.value)}
									on:aspectUpdated={handleAspectUpdated}
								/>
							{/each}
						{:else}
							<Spinner />
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#if filteredAspects.length > 0}
				{#each filteredAspects as aspect (aspect.name)}
					<Aspect
						{aspect}
						{selectedLocalization}
						aspectSlot={updateFilteredAspects("none")}
						on:aspectUpdated={handleAspectUpdated}
					/>
				{/each}
			{:else}
				<Spinner />
			{/if}
		</div>
	{/if}
</div>
