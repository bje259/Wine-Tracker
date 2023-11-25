import type { OwnedAspectFlatArray } from "../lib/types";
import type { Writable } from "svelte/store";
import { describe, expect, it } from "vitest";
import { OwnedAspectsClass } from "../lib/OwnedAspectsClass";
import { filterAspects } from "../lib/filterAspects";
import { newOwnedAspects } from "../store";


describe("OwnedAspectsClass", () => {
  it("should initialize with owned aspects", () => {
    const ownedAspects = new OwnedAspectsClass({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
    });
    expect(ownedAspects.length()).toBe(1);
    expect(ownedAspects.valid()).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Spider")).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Wolf")).toBe(false);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")
    ).toBe(true);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")
    ).toBe(false);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")[0]
      )
    ).toBe(true);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Wolf")[0]
      )
    ).toBe(false);
    expect(ownedAspects.getOwnedAspectsBySlotMatch("spider")).toEqual({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
    });
    expect(ownedAspects.getOwnedAspectsBySlotMatch("wolf")).toEqual({});
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")
      )
    ).toEqual([
      {
        note: "Spider",
        time: "2021-08-01T00:00:00.000Z",
        note_long: "Spider",
      },
    ]);
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "wolf",
        ownedAspects.getAspectsByName("Aspect of the Wolf")
      )
    ).toEqual([]);
  });

  it("should add and update owned aspects", () => {
    const ownedAspects = new OwnedAspectsClass({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
    });
    expect(ownedAspects.length()).toBe(1);
    expect(ownedAspects.valid()).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Spider")).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Wolf")).toBe(false);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")
    ).toBe(true);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")
    ).toBe(false);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")[0]
      )
    ).toBe(true);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Wolf")[0]
      )
    ).toBe(false);
    expect(ownedAspects.getOwnedAspectsBySlotMatch("spider")).toEqual({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
    });
    expect(ownedAspects.getOwnedAspectsBySlotMatch("wolf")).toEqual({});
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")
      )
    ).toEqual([
      {
        note: "Spider",
        time: "2021-08-01T00:00:00.000Z",
        note_long: "Spider",
      },
    ]);
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "wolf",
        ownedAspects.getAspectsByName("Aspect of the Wolf")
      )
    ).toEqual([]);

    ownedAspects.addAspect("Aspect of the Wolf", {
      note: "Wolf",
      time: "2021-08-01T00:00:00.000Z",
      note_long: "Wolf",
    });
    expect(ownedAspects.length()).toBe(2);
    expect(ownedAspects.valid()).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Spider")).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Wolf")).toBe(true);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")
    ).toBe(true);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")
    ).toBe(false);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")[0]
      )
    ).toBe(true);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Wolf")[0]
      )
    ).toBe(false);
    expect(ownedAspects.getOwnedAspectsBySlotMatch("spider")).toEqual({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
    });
    expect(ownedAspects.getOwnedAspectsBySlotMatch("wolf")).toEqual({});
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")
      )
    ).toEqual([
      {
        note: "Spider",
        time: "2021-08-01T00:00:00.000Z",
        note_long: "Spider",
      },
    ]);
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "wolf",
        ownedAspects.getAspectsByName("Aspect of the Wolf")
      )
    ).toEqual([]);

    ownedAspects.updateOwnedAspects({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
      "Aspect of the Wolf": [
        {
          note: "Wolf",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Wolf",
        },
      ],
    });
    expect(ownedAspects.length()).toBe(2);
    expect(ownedAspects.valid()).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Spider")).toBe(true);
    expect(ownedAspects.checkNameMatch("Aspect of the Wolf")).toBe(true);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Spider")
    ).toBe(true);
    expect(
      ownedAspects.checkSlotNameMatch("spider", "Aspect of the Wolf")
    ).toBe(false);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")[0]
      )
    ).toBe(true);
    expect(
      ownedAspects.checkSlotMatch(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Wolf")[0]
      )
    ).toBe(false);
    expect(ownedAspects.getOwnedAspectsBySlotMatch("spider")).toEqual({
      "Aspect of the Spider": [
        {
          note: "Spider",
          time: "2021-08-01T00:00:00.000Z",
          note_long: "Spider",
        },
      ],
    });
    expect(ownedAspects.getOwnedAspectsBySlotMatch("wolf")).toEqual({});
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "spider",
        ownedAspects.getAspectsByName("Aspect of the Spider")
      )
    ).toEqual([
      {
        note: "Spider",
        time: "2021-08-01T00:00:00.000Z",
        note_long: "Spider",
      },
    ]);
    expect(
      ownedAspects.getOwnedAspectsBySlotMatchArray(
        "wolf",
        ownedAspects.getAspectsByName("Aspect of the Wolf")
      )
    ).toEqual([]);
  });
});