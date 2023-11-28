<script lang="ts">
	import type { Cellar, Wine } from "$types";
	import {
		Banner,
		Button,
		CloseButton,
		Input,
		Modal,
		Select,
		Spinner,
		Textarea
	} from "flowbite-svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { Hamburger } from "svelte-hamburgers";
	import AddSpecificWine from "./lib/AddSpecificWine.svelte";
	import WineComp from "./lib/WineComp.svelte";
	import { myWineCellar } from "./store.js";

	import type { AspectFlatArray } from "$types";
	//imports
	import type {
		//AspectData,
		AspectDeteArray,
		AspectDetes
	} from "./lib/types";

	let ownedWinesString = "";
	let importWinesString = "";
	let cellar: Cellar = $myWineCellar.getCellar();
	let ownedWines: Wine[] = [];
	let searchParams: { [paramName: string]: { name: string; value: string }[] } = {
		producer: [{ name: "All Producers", value: "" }],
		variety: [{ name: "All Varieties", value: "" }],
		vineyard: [{ name: "All Vineyards", value: "" }]
	};
	let searchTerm = "";
	let selectedProducer = "";
	let selectedVariety = "";
	let selectedVineyard = "";
	let openNewWine = false;
	let openVerb = "Open";

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

	let selectedLocalization = "";
	//let selectedLocalization = localStorage.getItem("_localization") || "";

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

	let selectedSlot = "";
	let limitToOwned = false;
	let selectedCodex = "";
	let ownedAspectsString = "";
	let importAspectsString = "";
	//let filteredSlot = ''
	let importModal = false;
	let exportModal = false;
	const dispatch = createEventDispatcher();

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

	function loadOwnedWinesFromLocalStorage(): Cellar {
		const loadedOwnedWines: Cellar = {};

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) {
				const values = localStorage.getItem(key);
				console.log("loadfromstorage key " + key);
				if (values) {
					try {
						loadedOwnedWines[key] = JSON.parse(values) as Wine[];
					} catch (error) {
						console.error(`Error parsing data for key "${key}":`, error);
					}
				}
			}
		}
		console.log("loadfromstorage loadedOwnedWines /n");
		console.log(loadedOwnedWines);
		return loadedOwnedWines;
	}

	function handleWinesUpdated() {
		// Update the local data or trigger a refresh
		console.log("handleWinesUpdated (App.svelte) called loading from local storage");
		$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
		updateDDLs();
	}

	function addOptions(paramKey: string, newOptions: { name: string; value: string }[]) {
		if (searchParams[paramKey]) {
			searchParams[paramKey] = [...searchParams[paramKey], ...newOptions];
		} else {
			// Optionally handle the case where the paramKey does not exist
		}
	}

	function updateDDLs() {
		console.log("updateDDLs called");
		addOptions("producer", $myWineCellar.getProducerNames());
		addOptions("variety", $myWineCellar.getVarietyNames());
		addOptions("vineyard", $myWineCellar.getVineyardNames());
		console.log("updateDDLs searchParams");
		console.log(searchParams);
	}

	function clearSearch(setter: (value: string) => void): void {
		setter("");
	}

	function importData(e: MouseEvent): void {
		if (importWinesString === "") {
			return;
		}
		const importWines: Cellar = JSON.parse(importWinesString) as Cellar;

		// Save owned Wines to local storage
		for (const key in importWines) {
			const values = importWines[key];
			localStorage.setItem(key, JSON.stringify(values));
		}

		importWinesString = "";
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

	function deleteProducer(producer: string) {
		console.log("deleteProducer called");
		console.log(producer);
		localStorage.removeItem(producer);
		myWineCellar.update((current) => {
			if (current.removeProducer(producer)) {
				console.log("deleteProducer removed producer");
			} else {
				console.log("deleteProducer did not remove producer");
			}
			return current;
		});
		updateDDLs();
		dispatch("wineUpdated");
	}

	// Load owned aspects from local storage on component mount
	onMount(() => {
		$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
		dispatch("wineUpdated");
		cellar = $myWineCellar.getCellar();
		console.log("onMount called loading from local storage");
		console.log($myWineCellar.getCellar());

		updateDDLs();
	});

	$: {
		console.log("Reactive cellar in App.svelte updating from store");
		cellar = $myWineCellar.getFilteredCellar({
			searchterm: searchTerm,
			producer: selectedProducer,
			variety: selectedVariety,
			vineyard: selectedVineyard
		});
	}

	$: if (exportModal) {
		ownedWinesString = JSON.stringify(loadOwnedWinesFromLocalStorage());
		console.log("ownedWinesString");
	}

	$: {
		console.log(`Reactive check key length ${Object.keys(cellar).length}`);
		if (Object.keys(cellar).length > 0) {
			ownedWines = Object.values(cellar).flat();
			ownedAspectsString = JSON.stringify(ownedWines);
		}
		console.log("Printing ownedWines and ownedAspectsString");
		console.log(ownedWines);
		console.log(ownedAspectsString);
	}

	$: updateDDLs();
</script>

<!--Markup section-->
{#if false}
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
{/if}
<Modal title="Import Wines" bind:open={importModal} autoclose>
	<Textarea bind:value={importWinesString} />
	<Button on:click={importData}>Import</Button>
</Modal>

<Modal title="Export Aspects" bind:open={exportModal} autoclose>
	<Textarea bind:value={ownedWinesString} readonly />
	<Button on:click={copyText}>Copy</Button>
</Modal>

<Hamburger --color="grey" bind:open />
{#if open}
	<Button on:click={() => (exportModal = true)}>Export</Button>
	<Button on:click={() => (importModal = true)}>Import</Button>
{/if}
<!--primary UI section including search input fields and heard aspect information -->
<div class="p-4">
	<div class="mb-8 md:max-w-md mx-auto">
		<h1 class="text-2xl text-cyan-700 font-medium mb-4">Billy's Wine Cellar</h1>
		<Input bind:value={searchTerm} placeholder="Search by keyword" class="mt-2">
			<CloseButton slot="right" on:click={() => clearSearch((v) => (searchTerm = v))} />
		</Input>
		<Select
			placeholder="Select a producer"
			class="mt-2"
			items={searchParams.producer}
			bind:value={selectedProducer}
		/>
		<Select
			placeholder="Select a variety"
			class="mt-2"
			items={searchParams.variety}
			bind:value={selectedVariety}
		/>
		<Select
			placeholder="Select a vineyard"
			class="mt-2"
			items={searchParams.vineyard}
			bind:value={selectedVineyard}
		/>
		<AddSpecificWine producer={"_New Producer"} on:wineUpdated={handleWinesUpdated} />
	</div>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if Object.keys(cellar).length > 0}
			{#each Object.keys(cellar) as producer (producer)}
				<div class="mb-8 flex flex-col">
					<h1 class="text-2xl text-cyan-500 font-medium mb-4">
						{producer}
					</h1>
					{#each cellar[producer] as wine, i (wine)}
						<WineComp {wine} {producer} index={i} on:wineUpdated={handleWinesUpdated} />
					{/each}
					<div
						class="grid grid-cols-1 gap-1 overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700"
					>
						<AddSpecificWine {producer} on:wineUpdated={handleWinesUpdated} />

						<Button
							type="button"
							class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
							on:click={() => deleteProducer(producer)}
						>
							Delete all wines from producer
						</Button>
					</div>
				</div>
			{/each}
		{:else}
			<Spinner />
		{/if}
	</div>
</div>
