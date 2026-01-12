import { Attribute, Modifier } from '@rhtml/custom-attributes';
import { HostListener } from '@rhtml/decorators';

/**
 * @customAttribute routerLink
 */
@Modifier({
  selector: 'routerLink',
})
export class RouterLink extends Attribute {
  @HostListener('click')
  onClick() {
    const { pathname, search, hash } = this.getFullRoute();

    window.dispatchEvent(
      new CustomEvent(`router-go`, {
        cancelable: true,
        detail: {
          pathname,
          search: search || '',
          hash: hash || '',
        },
      })
    );
  }

  private get queryParams() {
    return this.element.getAttribute('queryParams');
  }

  private get hasParams() {
    return this.element.hasAttribute('queryParams');
  }

  private getFullRoute() {
    if (this.hasParams) {
      const params = new URLSearchParams(this.parseParams());
      return this.getUrl([this.value, '?', params.toString()].join(''));
    }

    return this.getUrl(this.value);
  }

  private getUrl(path: string) {
    return new URL(path, 'http://a');
  }

  private parseParams() {
    return JSON.parse(this.queryParams ?? '{}');
  }
}

/**
 * Method helper for stringifying data so we can pass it to `queryParams` attribute
 * Without helper: `<div routerLink=${'/projects'} queryParams='{"tracingId": 123}'>CLICK</div>`
 * With helper: `<div routerLink=${'/projects'} queryParams=${stringify({ tracingId: 123 })}>CLICK</div>`
 */
export const stringify = (data: Record<string, unknown>) =>
  JSON.stringify(data);

/**
 * Additionally for extracting query parameters we could use this method directly from the router @rhtml/router itself
 * const params = this.router.getQueryParams<{ tracingId: string }>();
 * console.log(params.tracingId);
 */
export const getQueryParams = <T>() =>
  [...new URLSearchParams(location.search)].reduce(
    (prev, [key, value]) => ({ ...prev, [key]: value }),
    {} as T
  );
