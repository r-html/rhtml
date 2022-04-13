export const noop = function() {
  /*  */
};

export const observe = (target: unknown, memberName: string) => {
  const prototype = target.constructor.prototype;
  const OnInit = prototype.OnInit || noop;
  const OnDestroy = prototype.OnDestroy || noop;
  const OnUpdateAttribute = prototype.OnUpdateAttribute || noop;

  let observer: MutationObserver;
  prototype.OnInit = function() {
    const element = this.element ?? this;
    if (observer) {
      observer.disconnect();
    }
    observer = new MutationObserver(() => {
      OnUpdateAttribute.call(
        this,
        memberName,
        element.getAttribute(memberName)
      );
      target[memberName] = element.getAttribute(memberName);
    });
    observer.observe(element, {
      attributeFilter: [memberName],
      attributes: true
    });
    return OnInit.call(this);
  };
  prototype.OnDestroy = function() {
    observer.disconnect();
    return OnDestroy.call(this);
  };
};
