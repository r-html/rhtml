import '@rhtml/renderer';

import { IfOperator } from './if';
import { ForOperator } from './for';
import { LetOperator } from './let';

export * from './for';
export * from './let';
export * from './if';

declare global {
  interface HTMLElementTagNameMap {
    'r-if': IfOperator;
    'r-let': LetOperator;
    'r-for': ForOperator;
  }
}
