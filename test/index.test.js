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

  it("should do MAGIC", async () => {
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
    console.log("test log message");
    console.info("test info message");
    console.warn("test warn message");
    console.error("test error message");
    // The expect package has the toBeInstanceOf matcher, and jasmine doesn't
    expect([]).toBeInstanceOf(Array);
  });

  describe("let's", () => {
    describe("get", () => {
      describe("some", () => {
        describe("really", () => {
          describe("deep", () => {
            describe("nesting", () => {
              describe("up", () => {
                describe("in", () => {
                  describe("here", () => {
                    it("this one passes", () => {});
                    it("this one fails", () => {
                      expect(2 + 2).toBe(3);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

test("can do test", () => {
  // passes
});

xdescribe("skipped suite", () => {
  it("is skipped", () => {
    throw new Error("abcd");
  });
});

xit("skipped spec", () => {});
