import {
  MediaQueryAttribute,
  MediaQueryEvent,
  Modifier,
} from '@rhtml/custom-attributes';

interface Styles {
  flex: string;
  boxSizing: string;
  minWidth: string;
  maxWidth?: string;
}

@Modifier({
  selector: 'fxFlex',
})
export class Flex extends MediaQueryAttribute<Styles> {
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

  OnEnterMediaQuery([, attribute]: MediaQueryEvent) {
    this.prevValue = this.value;
    this.value = attribute.value ?? this.value;
    this.modify();
  }

  OnExitMediaQuery() {
    this.value = this.prevValue ?? this.value;
    this.modify();
  }

  clean() {
    this.setStyles({
      boxSizing: null,
      flex: null,
      minWidth: null,
      maxWidth: null,
    })(this.element);
  }

  modify() {
    let grow = '1';
    let shrink = '1';
    let basis = '0.000000001px';
    let flex = `${grow} ${shrink} ${basis}`;
    let maxWidth: string = null;

    if (this.value) {
      const parts = this.value.split(' ');
      if (parts.length === 1) {
        const val = parts[0];
        if (val === 'none') {
          flex = 'none';
          maxWidth = 'none';
        } else if (val === 'initial') {
          flex = 'initial';
        } else if (val === 'auto') {
          grow = '1';
          shrink = '1';
          basis = 'auto';
          flex = `${grow} ${shrink} ${basis}`;
        } else if (val.endsWith('%') || val.endsWith('px')) {
          basis = val;
          flex = `${grow} ${shrink} ${basis}`;
          maxWidth = '100%';
        } else if (!isNaN(Number(val))) {
          basis = `${val}%`;
          flex = `${grow} ${shrink} ${basis}`;
          maxWidth = '100%';
        } else {
          basis = val;
          flex = `${grow} ${shrink} ${basis}`;
        }
      } else {
        [grow = '1', shrink = '1', basis = '0.000000001px'] = parts;
        flex = `${grow} ${shrink} ${basis}`;
      }
    }

    this.setStyles({
      boxSizing: 'border-box',
      flex,
      minWidth: '0',
      maxWidth,
    })(this.element);
  }
}
