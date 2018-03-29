const sleep = ms => new Promise(r => setTimeout(r, ms));

describe("demo", () => {
  it("should work", () => {
    expect(1).toEqual(1);
  });

  it("should handle deep equality", () => {
    expect({ foo: 1 }).toEqual({ foo: 1 });
  });

  it("should handle async tests", async () => {
    let start = Date.now();
    await sleep(100);

    let now = Date.now();
    expect(now - start).toBeGreaterThan(50);
  });

  it("should support using loaders from the current project", async () => {
    let lib = await import("workerize-loader!./fixture.worker.js");
    expect(lib).toEqual(jasmine.any(Function));
    let mod = lib();
    expect(await mod.foo()).toEqual(1);
  });

  it("should support electron require", () => {
    /* global electron */
    const Module = electron.require("module");
    expect(Array.isArray(Module.globalPaths)).toBe(true);

    const fixture = electron.require("./test/fixture");
    expect(fixture).toBe("fixture");
  });

  it("should support a test setup file", () => {
    expect(window.testSetupRan).toBe(true);
  });

  it("should use the expect package instead of jasmine's expect", () => {
    // The expect package has the toBeInstanceOf matcher, and jasmine doesn't
    expect([]).toBeInstanceOf(Array);
  });
});
