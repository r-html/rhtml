import { CustomAttributeRegistry } from './custom-registry';

export type C<T> = new (...args: never[]) => T;

export interface Constructor<T> extends C<T> {
  options: ModifierOptions;
}

export interface ModifierOptions {
  selector: string;
  registry?(this: HTMLElement): CustomAttributeRegistry;
  observedAttributes?: string[];
}

export interface InputOptions {
  /**
   * If enabled will trigger OnUpdate method on the Attribute
   * */
  observe: true;
}
