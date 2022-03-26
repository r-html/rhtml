import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  margin: string;
  flex: string;
}

@Modifier({
  selector: 'fxLayoutGap'
})
export class LayoutGap extends Attribute<Styles> {
  private observer: MutationObserver;

  OnInit() {
    this.modify();
    this.observer = new MutationObserver(() => this.modify());
    this.observer.observe(this.element, {
      childList: true,
      subtree: true
    });
  }

  OnDestroy() {
    this.clean();
    this.observer.disconnect();
  }

  OnUpdate() {
    this.modify();
  }

  private clean() {
    const divs = [...this.element.children] as HTMLElement[];
    for (const div of divs) {
      this.setStyles({
        flex: null,
        margin: null
      })(div);
    }
  }

  private modify() {
    const divs = this.element.children;
    for (const div of divs) {
      this.setStyles({
        flex: '1 1 25%',
        margin: `0px ${this.value} ${this.value} 0px`
      })(div);
    }
  }
}
