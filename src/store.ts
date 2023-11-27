import { writable } from "svelte/store";
import { OwnedAspectsClass } from "./lib/OwnedAspectsClass";
import WineCellar from "./lib/WineCellar";
import type { DebugEntry, DebugData, DebugArray } from "./lib/types";
export const newOwnedAspects = writable(new OwnedAspectsClass({}));
export const showSlotBasedViewStore = writable(false); // Initialize with 'false'
export const slotFilterStore = writable(""); // New store for slotFilter
export const debug1 = writable(""); // New store for debug
export const debug2 = writable(""); // New store for debug
export const debug3 = writable(""); // New store for debug
export const debug4 = writable(""); // New store for debug
export const debug5 = writable(""); // New store for debug
export const debugData = writable<DebugData>([]); // New store for debug
export const debugArray = writable<DebugArray>([]); // New store for debugArray
export const showAspectStore = writable<boolean>(true); // New store for showAspect
export const myWineCellar = writable(new WineCellar()); // New store for myWineCellar