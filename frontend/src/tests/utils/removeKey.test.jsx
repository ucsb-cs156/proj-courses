import { removeKey } from "main/utils/removeKey";
describe("removeKey tests", () => {
  test("it returns the object with key property removed", () => {
    const obj = { key: "k", foo: "f", bar: "b" };
    expect(removeKey(obj)).toEqual({ foo: "f", bar: "b" });
  });
});
