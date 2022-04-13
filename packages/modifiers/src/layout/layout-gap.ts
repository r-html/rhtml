import {
  createFiltersFromSelector,
  EnterMediaQueryAttributes,
  MediaQueryAttribute,
  Modifier
} from '@rhtml/custom-attributes';

interface Styles {
  margin: string;
  flex: string;
}

@Modifier({
  selector: 'fxLayoutGap'
})
export class LayoutGap extends MediaQueryAttribute<Styles> {
  private observer: MutationObserver;

  OnInit() {
    this.modify();
    this.observer = new MutationObserver(() => this.modify());
    this.observer.observe(this.element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: createFiltersFromSelector('fxlayout')
    });
    super.OnInit();
  }

  OnDestroy() {
    this.clean();
    this.observer.disconnect();
    super.OnDestroy();
  }

  OnUpdate() {
    this.modify();
  }

  OnEnterMediaQuery([, attribute]: EnterMediaQueryAttributes) {
    this.prevValue = this.value;
    this.value = attribute.value ?? this.value;
    this.modify();
  }

  OnExitMediaQuery() {
    this.value = this.prevValue ?? this.value;
    this.modify();
  }

  // OnElementAttributeChange() {

  // }

  clean() {
    const divs = [...this.element.children] as HTMLElement[];
    for (const div of divs) {
      this.setStyles({
        flex: null,
        margin: null
      })(div);
    }
  }

  modify() {
    const layout = this.element.getAttribute('fxlayout');
    let margin = `0px ${this.value} ${this.value} 0px`;
    if (layout === 'row') {
      margin = `0px ${this.value} 0px 0px`;
    }
    if (layout === 'column') {
      margin = `0px 0px ${this.value} 0px`;
    }
    const divs = this.element.children;
    for (const div of divs) {
      this.setStyles({
        flex: '1 1 25%',
        margin
      })(div);
    }
  }
}
