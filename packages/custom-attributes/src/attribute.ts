/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModifierOptions } from './types';

/*  */
export abstract class Attribute<T = {}> {
  public static options: ModifierOptions;
  public element?: HTMLElement;
  public value?: string;
  public selector?: string;
  public parent?: HTMLElement;
  public observer?: MutationObserver;
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
  OnUpdate(_oldValue: string, _newValue: string) {
    /* */
  }
  OnUpdateAttribute(_name: string, _value: string) {
    /* */
  }

  OnChange(_records: MutationRecord[]): void {
    /* */
  }
}
