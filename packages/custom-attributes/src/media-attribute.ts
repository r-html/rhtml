import { Attribute } from './attribute';

/**
 * Media query Attribute
 * for performance reasons it is key value pair
 */
export const MediaMatchers = new Map([
  ['screen and (max-width: 599px)', 'xs'],
  ['screen and (min-width: 600px) and (max-width: 959px)', 'sm'],
  ['screen and (min-width: 960px) and (max-width: 1279px)', 'md'],
  ['screen and (min-width: 1280px) and (max-width: 1919px)', 'lg'],
  ['screen and (min-width: 1920px) and (max-width: 5000px)', 'xl'],
  ['screen and (max-width: 959px)', 'lt-md'],
  ['screen and (max-width: 1279px)', 'lt-lg'],
  ['screen and (max-width: 1919px)', 'lt-xl'],
  ['screen and (min-width: 600px)', 'gt-xs'],
  ['screen and (min-width: 960px)', 'gt-sm'],
  ['screen and (min-width: 1280px)', 'gt-md'],
  ['screen and (min-width: 1920px)', 'gt-lg']
]);
type MediaEvent = MediaQueryList | MediaQueryListEvent;
export type EnterMediaQueryAttributes = [MediaEvent, Attr];
export type ExitMediaQueryAttributes = [MediaEvent, string];

export interface OnUpdateMediaQuery {
  OnEnterMediaQuery(tuple: [MediaEvent, Attr]): void;
  OnExitMediaQuery(tuple: [MediaEvent, string]): void;
}

export const Breakpoints = [...MediaMatchers.values()];

export const createFiltersFromSelector = (selector: string) => [
  ...Breakpoints.map(breakpoint => `${selector}.${breakpoint}`),
  selector
];

export abstract class MediaQueryAttribute<T> extends Attribute<T>
  implements OnUpdateMediaQuery {
  prevValue: string;
  originalValue: string;

  private matchers: Map<MediaQueryList, MediaQueryList> = new Map();
  private cachedAttributes: Map<string, Attr> = new Map();

  listener = (event: MediaQueryList | MediaQueryListEvent) => {
    const key = `${this.selector.toLowerCase()}.${MediaMatchers.get(
      event.media
    )}`;
    const attribute = this.cachedAttributes.get(key);

    if (event.matches && attribute) {
      return this.OnEnterMediaQuery([event, attribute]);
    }
    return this.OnExitMediaQuery([event, key]);
  };

  OnInit() {
    if (this.OnEnterMediaQuery || this.OnExitMediaQuery) {
      this.originalValue = this.value;
      for (const query of MediaMatchers.keys()) {
        const matcher = window.matchMedia(query);

        const attr = Object.values(this.element.attributes).find(
          v =>
            v.name ===
            `${this.selector.toLowerCase()}.${MediaMatchers.get(query)}`
        );

        if (attr) {
          this.cachedAttributes.set(attr.name, attr);
          matcher.addEventListener('change', this.listener);
        }

        if (attr && matcher.matches) {
          this.listener(matcher);
        }
        this.matchers.set(matcher, matcher);
      }
    }
  }

  OnDestroy() {
    for (const matcher of this.matchers.values()) {
      matcher.removeEventListener('change', this.listener);
    }
    this.cachedAttributes.clear();
    this.matchers.clear();
  }

  abstract OnEnterMediaQuery(tuple: [MediaEvent, Attr]): void;
  abstract OnExitMediaQuery(tuple: [MediaEvent, string]): void;
}
