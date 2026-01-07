import '@rhtml/renderer';

import {
  Component as OriginalComponent,
  CustomElementConfig,
  html,
  LitElement,
  TemplateResult,
} from '@rxdi/lit-html';
import { Observable } from 'rxjs';

export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Injection = {
  has: <T>(d: T) => boolean;
  get: <T>(d: T) => T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = any> = new (...args: any[]) => T;

export type InstanceTypes<T> = {
  [P in keyof T]: T[P] extends Constructor<infer U> ? U : never;
};

export const DefineDependencies =
  <T extends Constructor[]>(...deps: T) =>
  (injection: Injection): InstanceTypes<T> => {
    for (const [index, dep] of deps.entries()) {
      Object.defineProperty(deps, index, {
        get: () => (injection && injection.has(dep) ? injection.get(dep) : dep),
      });
    }
    return deps as never;
  };

export type StateToRender<S, D, K extends LitElement> = (
  this: K,
  deps: D
) => Observable<S> | S | Promise<S>;

export type PossibleRender = TemplateResult | string | number | unknown;

export type RenderResult<S, D, K extends LitElement> = (
  deps: D
) => (
  this: K,
  state: S,
  setState: (s: S) => void
) => TemplateResult | string | number | unknown;

export interface Options
  extends Without<CustomElementConfig<never>, 'template'> {
  deepCloneState?: boolean;
}

export interface OnRendererLoaded {
  OnRendererLoaded(): void;
}

/**
 * This method waits for the parent component to finish loading and then triggers event
 * OnRendererLoaded is a specially designed hook to wait for the last dom rerender
 * before calling the callback
 */
async function waitBeforeTrigger(this: LitElement & OnRendererLoaded) {
  await this.updateComplete;
  await new Promise(requestAnimationFrame);
  this.OnRendererLoaded?.call(this);
}

export const Partial =
  <S, D, K extends LitElement = LitElement>(options: Options) =>
  (deps: D = [] as never) =>
  (state: StateToRender<S, D, K> = () => ({} as never)) =>
  (loading: (this: K) => PossibleRender = () => null) =>
  (error: (this: K, e: Error) => PossibleRender = () => null) =>
  (render: RenderResult<S, D, K> = () => state as never) =>
    OriginalComponent<K>({
      ...options,
      template(this: K) {
        return html`
          <r-renderer
            @loaded=${waitBeforeTrigger.bind(this)}
            .options=${{
              state: state.bind(this).call(this, deps),
              loading: loading.bind(this),
              error: error.bind(this),
              deepCloneState: options.deepCloneState,
              render: (
                state: S,
                setState: (s: S) => void,
                shadowRoot: ShadowRoot
              ) => {
                this.shadowRoot.append(shadowRoot);
                return render(deps)
                  .bind(this)
                  .call(this, state, setState, shadowRoot);
              },
            } as never}
          ></r-renderer>
        `;
      },
    });

export function Component<S, D, K extends LitElement = LitElement>({
  Settings,
  Providers,
  State,
  Render,
  Loading,
  Error,
}: {
  Settings: Options;
  Providers?: D;
  State?: StateToRender<S, D, K>;
  Render?: RenderResult<S, D, K>;
  Loading?: () => PossibleRender;
  Error?: (e: Error | unknown) => PossibleRender;
}) {
  return Partial(Settings)(Providers)(State)(Loading)(Error)(Render);
}
