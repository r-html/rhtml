import { Component, LitElement, property, html, async } from '@rxdi/lit-html';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'r-let',
  template(this: LetOperator) {
    return html`
      ${async(
        this.data.pipe(
          map(v =>
            v.map(
              (element, index, array) =>
                html`
                  ${this.item(element, index, array)}
                `
            )
          )
        )
      )}
    `;
  }
})
export class LetOperator extends LitElement {
  @property({ attribute: false })
  public data: Observable<any[]> = of([]);

  @property()
  public item: any = (v: any) =>
    html`
      ${v}
    `;
}
