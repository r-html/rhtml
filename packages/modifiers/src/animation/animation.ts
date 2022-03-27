import {
  Attribute,
  CustomAttributeRegistry,
  Input,
  Modifier
} from '@rhtml/custom-attributes';

import { Animations } from './animate.css';
import { AnimationsType } from './interfaces';

interface Styles {
  animationDelay: string;
}

@Modifier({
  selector: 'animated',
  registry(this: HTMLElement) {
    return new CustomAttributeRegistry(this);
  }
})
export class Animation extends Attribute<Styles> {
  @Input({ observe: true })
  delay: string;

  value: AnimationsType;

  OnInit() {
    this.pushStylesToParent();
    this.modify();
  }

  OnDestroy() {
    this.element.classList.remove('animated', this.value);
    this.setStyles({ animationDelay: null })(this.element);
  }

  OnUpdate() {
    this.modify();
  }

  OnUpdateAttribute() {
    this.modify();
  }

  private modify() {
    this.element.classList.add('animated', this.value);
    this.setStyles({ animationDelay: this.delay })(this.element);
  }

  private pushStylesToParent() {
    const style = document.createElement('style');
    style.innerHTML = Animations;
    const root = this.parent.shadowRoot ?? this.parent;
    root.prepend(style);
  }
}
