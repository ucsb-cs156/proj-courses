import { compareValues } from "main/utils/sortHelper";

describe("sortHelper tests", () => {
  var singers = [];
  var arr = [];

  const tyler = { name: "Steven Tyler", band: "Aerosmith", born: 1948 };
  const carpenter = {
    name: "Karen Carpenter",
    band: "The Carpenters",
    born: 1950,
  };
  const cobain = { name: "Kurt Cobain", band: "Nirvana", born: 1967 };
  const nicks = { name: "Stevie Nicks", band: "Fleetwood Mac", born: 1948 };

  const arr1 = { name: "b", id: 2 };
  const arr2 = { name: "A", id: 1 };
  const arr3 = { name: "a" };

  beforeEach(() => {
    singers = [tyler, carpenter, cobain, nicks];
    arr = [arr1, arr2, arr3];
  });

  test("should sort by name", async () => {
    singers.sort(compareValues("name"));
    expect(singers).toEqual([carpenter, cobain, tyler, nicks]);
  });

  test("should sort by name ascending", async () => {
    singers.sort(compareValues("name", "asc"));
    expect(singers).toEqual([carpenter, cobain, tyler, nicks]);
  });

  test("should sort by band, descending", async () => {
    singers.sort(compareValues("band", "desc"));
    expect(singers).toEqual([carpenter, cobain, nicks, tyler]);
  });

  test("should sort by year born", async () => {
    singers.sort(compareValues("born"));
    expect(singers).toEqual([tyler, nicks, carpenter, cobain]);
  });

  test("should not sort at all", async () => {
    singers.sort(compareValues("potato"));
    expect(singers).toEqual(singers);
  });

  test("should not sort at all with empty compareValues", async () => {
    singers.sort(compareValues(""));
    expect(singers).toEqual(singers);
  });

  test("should sort properly with capitals", async () => {
    arr.sort(compareValues("name"));
    expect(arr).toEqual([arr2, arr3, arr1]);
  });

  test("should sort properly with some missing fields", async () => {
    arr.sort(compareValues("id"));
    expect(arr).toEqual([arr2, arr1, arr3]);
  });
});
