export const Input = () => (target: unknown, memberName: string) => {
  Object.defineProperty(target, memberName, {
    get: function() {
      return this.element.getAttribute(memberName.toLowerCase());
    }
  });
};
