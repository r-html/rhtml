import { ModifierOptions } from './types';

/*  */
export abstract class Attribute<T = {}> {
  public static options: ModifierOptions;
  public element?: HTMLElement;
  public value?: string;
  public selector?: string;
  public parent?: HTMLElement;
  setStyles(keys: T) {
    return (div: HTMLElement | Element | HTMLDivElement) => {
      for (const [key, value] of Object.entries(keys)) {
        div['style'][key] = value;
      }
    };
  }
  OnInit(): void {
    /* */
  }
  OnDestroy(): void {
    /* */
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OnUpdate(_oldValue: string, _newValue: string) {
    /* */
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OnUpdateAttribute(_name: string, _value: string) {
    /* */
  }
}
