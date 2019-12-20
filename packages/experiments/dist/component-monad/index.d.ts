import { RComponentOperator } from './r-component';
import { RKeyOperator } from './r-key';
import { RPropOperator } from './r-prop';
import { RPropsOperator } from './r-props';
import { RTemplateOperator } from './r-template';
declare global {
    interface HTMLElementTagNameMap {
        'r-component': RComponentOperator;
        'r-key': RKeyOperator;
        'r-prop': RPropOperator;
        'r-props': RPropsOperator;
        'r-template': RTemplateOperator;
    }
}
export * from './r-component';
export * from './r-key';
export * from './r-prop';
export * from './r-props';
export * from './r-template';
