import { CustomAttributeRegistry } from './custom-registry';

export type C<T> = new (...args: never[]) => T;

export interface Constructor<T> extends C<T> {
  options: ModifierOptions;
}

export interface ModifierOptions {
  /**
   * Main selector of the attribute
   */
  selector: string;
  /**
   * Define custom attribute registry
   */
  registry?(this: HTMLElement): CustomAttributeRegistry;
  /**
   * Specify attributes to be listened
   */
  observedAttributes?: string[];
  /**
   * Define MutationObserver to listen for parent element changes
   * Defining property will attach observer to this.element
   *  */
  observe?: MutationObserverInit;
}

export interface InputOptions {
  /**
   * If enabled will trigger OnUpdate method on the Attribute
   * */
  observe: true;
}
