it("should use the stage-0 preset out of the box", () => {
  // should not fail to parse
  /* eslint-disable */
  function newSyntax() {
    foo::bar();
    const { abc } = { ...oneTwoThree };
    return new.target;
  }
});
