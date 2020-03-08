import { LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-props
 */
export declare class RPropsOperator extends LitElement {
    private nodes;
    props: {};
    OnUpdateFirst(): void;
    OnDestroy(): void;
    isString(value: any): boolean;
    isNumber(value: any): boolean;
    isBoolean(value: any): boolean;
    isObject(value: any): boolean;
    castToType(value: any, type: String | Boolean | Number | Object): void;
}
