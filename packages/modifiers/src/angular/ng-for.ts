import { Attribute, Input, Modifier } from '@rhtml/custom-attributes';
import { html, render, unsafeHTML } from '@rxdi/lit-html';

@Modifier({
  selector: 'ngFor',
})
export class NgFor extends Attribute {
  @Input()
  ngFor: string;

  regexes = [/\${[^{]+}/g, /\@\{(.*?)(?!\@\{)\}/g, /{([^}]+)}/g];

  OnInit() {
    this.modify();
  }

  OnDestroy() {
    //
  }

  OnUpdate() {
    this.modify();
  }

  private interpolate(object, string: string) {
    return string.replace(this.regexes[2], (match) =>
      match
        .slice(2, -1)
        .trim()
        .split('.')
        .reduce((el, k: string) => String(el[k]), object)
    );
  }

  private modify() {
    const [, , , items] = this.ngFor.split(' ');
    const template = this.element.innerHTML;
    this.element.innerHTML = '';
    render(
      html`
        <r-for .of=${this.parent[items]}>
          <r-let
            .item=${(i) => unsafeHTML(this.interpolate(i, template))}
          ></r-let>
        </r-for>
      `,
      this.element
    );
  }
}
