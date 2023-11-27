<script lang="ts">
	//import WineCellar from './WineCellar';
	import type { Wine } from "$types";
	import { Button } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	import { myWineCellar } from "../store";

	const dispatch = createEventDispatcher();

	export let producer: string;
	export let wine: Wine;

	let openNewWine = false;
	let tempWines: Wine[] = [];
	$: ownedWines = $myWineCellar.getWinesByProducer(producer) || [];

	function handleWineUpdated() {
		let storedValue = localStorage.getItem(producer) ?? "[]";
		try {
			tempWines = JSON.parse(storedValue);
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			tempWines = [];
		}
		console.log(`ZZ Wine handleWineUpdated - tempWines: ${tempWines}`);
		myWineCellar.update((current) => {
			current.updateCellarByProducer(producer, tempWines);
			return current;
		});
		tempWines = [];
		dispatch("wineUpdated");
	}
	function qtyIncrement() {
		console.log(`ZZ Wine qtyIncrement - producer: ${producer} - wine:`);
		console.log(wine);
		console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wine.Qty}`);

		wine.Qty = wine.Qty + 1;
		console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wine.Qty}`);
		let storedValue = localStorage.getItem(producer) ?? "[]";
		try {
			tempWines = JSON.parse(storedValue);
			console.log(`ZZ Wine qtyIncrement - pulled producer's wines from local storage:`);
			console.log(tempWines);
			myWineCellar.update((current) => {
				current.updateCellarByProducer(producer, tempWines);
				return current;
			});
			console.log("Updated myWineCellar with tempWines");
			console.log($myWineCellar.getWinesByProducer(producer));
			myWineCellar.update((current) => {
				current.updateWine(producer, wine);
				return current;
			});
			console.log(`Updated myWineCellar with wine
				${wine["Wine Name"]}
				${wine.Qty}`);
			console.log("New myWineCellar wine entry:");
			console.log($myWineCellar.getWinesByProducerWineName(producer, wine["Wine Name"]));
			console.log("updating local storage");
			tempWines = $myWineCellar.getWinesByProducer(producer);
			let tempWinesString = JSON.stringify(tempWines);
			localStorage.setItem(producer, tempWinesString);
			console.log("local storage updated");
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			tempWines = [];
		}
		tempWines = [];
		dispatch("wineUpdated");
	}

	function qtyDecrement() {
		console.log(`ZZ Wine qtyDecrement - producer: ${producer} - wine:`);
		console.log(wine);
		console.log(`ZZ Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
		if (wine.Qty > 0) {
			wine.Qty = wine.Qty - 1;
			console.log(`ZZ Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
			let storedValue = localStorage.getItem(producer) ?? "[]";
			try {
				tempWines = JSON.parse(storedValue);
				console.log(`ZZ Wine qtyDecrement - pulled producer's wines from local storage:`);
				console.log(tempWines);
				myWineCellar.update((current) => {
					current.updateCellarByProducer(producer, tempWines);
					return current;
				});
				console.log("Updated myWineCellar with tempWines");
				console.log($myWineCellar.getWinesByProducer(producer));
				myWineCellar.update((current) => {
					current.updateWine(producer, wine);
					return current;
				});
				console.log(`Updated myWineCellar with wine
				${wine["Wine Name"]}
				${wine.Qty}`);
				console.log("New myWineCellar wine entry:");
				console.log($myWineCellar.getWinesByProducerWineName(producer, wine["Wine Name"]));
				console.log("updating local storage");
				tempWines = $myWineCellar.getWinesByProducer(producer);
				let tempWinesString = JSON.stringify(tempWines);
				localStorage.setItem(producer, tempWinesString);
				console.log("local storage updated");
			} catch (error) {
				console.error("Error parsing JSON from localStorage", error);
				tempWines = [];
			}

			tempWines = [];
			dispatch("wineUpdated");
		} else {
			console.log("Error wine cannot go below 0");
		}
	}

	function deleteWine() {
		console.log(`ZZ Wine deleteWine - wine: ${wine}`);
		console.log(`ZZ Wine deleteWine - wine.Qty: ${wine.Qty}`);
		if (wine.Qty > 0) {
			wine.Qty = 0;
			console.log(`ZZ Wine deleteWine - wine.Qty: ${wine.Qty}`);
			let storedValue = localStorage.getItem(wine["Wine Name"]) ?? "[]";
			try {
				ownedWines = JSON.parse(storedValue);
			} catch (error) {
				console.error("Error parsing JSON from localStorage", error);
				ownedWines = [];
			}
			console.log(`ZZ Wine deleteWine - ownedWines: ${ownedWines}`);
			myWineCellar.update((current) => {
				current.updateCellarByProducer(producer, ownedWines);
				return current;
			});

			dispatch("wineUpdated");
		}
	}
</script>

<div class="mb-8 flex flex-col">
	<h3 class="text-lg font-medium mb-2 text-amber-600">
		Name: {wine["Wine Name"]}<br />Vineyard Location: {wine["Vineyard Location"]}<br />Variety: {wine.Variety
			? `(${wine.Variety})`
			: ""}
	</h3>
	<div class="flex flex-col">
		<p class="text-base mb-4 flex-grow">
			Vintage: {wine.Vintage ? `${wine.Vintage} ` : ""}
			<br />Bin: {wine.Bin ? `${wine.Bin} ` : ""}
			<br />Qty: {Number.isFinite(wine.Qty) ? `${wine.Qty} ` : ""}
			<br />Purchase Date: {wine.Purchased ? `${wine.Purchased} ` : ""}
			{#if wine.Notes !== undefined && wine.Notes !== null && wine.Notes !== ""}
				<br />
				Notes: {wine.Notes}
			{/if}
		</p>
		<div
			class="grid grid-cols-2 gap-1 overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700"
		>
			<Button
				type="button"
				class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
				on:click={qtyIncrement}
			>
				+
			</Button>

			<Button
				type="button"
				class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
				on:click={qtyDecrement}
			>
				-
			</Button>
		</div>
	</div>
</div>
