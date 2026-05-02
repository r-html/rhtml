import {
  createFiltersFromSelector,
  MediaQueryAttribute,
  MediaQueryEvent,
  Modifier,
} from '@rhtml/custom-attributes';

interface Styles {
  margin: string;
}

@Modifier({
  selector: 'fxLayoutGap',
  observe: {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: createFiltersFromSelector('fxlayout'),
  },
})
export class LayoutGap extends MediaQueryAttribute<Styles> {
  private prevValue: string;

  OnInit() {
    this.modify();
    super.OnInit();
  }

  OnDestroy() {
    this.clean();
    super.OnDestroy();
  }

  OnUpdate() {
    this.modify();
  }

  OnChange() {
    this.modify();
  }

  OnEnterMediaQuery([, attribute]: MediaQueryEvent) {
    this.prevValue = this.value;
    this.value = attribute.value ?? this.value;
    this.modify();
  }

  OnExitMediaQuery() {
    this.value = this.prevValue ?? this.value;
    this.modify();
  }

  private clean() {
    const divs = [...this.element.children] as HTMLElement[];
    for (const div of divs) {
      this.setStyles({
        margin: null,
      })(div);
    }
  }

  private modify() {
    const layout = (this.element.getAttribute('fxlayout') || '').split(' ')[0];
    const isRow = layout === 'row';
    const isColumn = layout === 'column';
    const divs = this.element.children;
    const lastIndex = divs.length - 1;

    for (let i = 0; i < divs.length; i++) {
      const div = divs[i] as HTMLElement;
      const isLast = i === lastIndex;

      if (isLast) {
        if (isRow) {
          this.setStyles({ margin: '0' })(div);
        } else if (isColumn) {
          this.setStyles({ margin: '0 0 0 0' })(div);
        }
      } else {
        if (isRow) {
          this.setStyles({ margin: `0 ${this.value} 0 0` })(div);
        } else if (isColumn) {
          this.setStyles({ margin: `0 0 ${this.value} 0` })(div);
        }
      }
    }
  }
}
