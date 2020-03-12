import '@rhtml/renderer';

import { ForOperator } from './for';
import { IfOperator } from './if';
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
