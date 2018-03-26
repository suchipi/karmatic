/** @jsx createElement */

describe("Custom JSX Pragma", () => {
  it("should use custom babel config", () => {
    let h = jasmine.createSpy("h");
    let createElement = jasmine.createSpy("createElement");
    let React = { createElement: jasmine.createSpy("React.createElement") };

    // eslint-disable-next-line no-unused-expressions
    <div id="foo">hello</div>;

    expect(h).not.toHaveBeenCalled();
    expect(React.createElement).not.toHaveBeenCalled();
    expect(createElement).toHaveBeenCalledWith("div", { id: "foo" }, "hello");
  });
});
