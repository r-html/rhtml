import { Renderer } from './renderer';
declare global {
    interface HTMLElementTagNameMap {
        'r-renderer': Renderer;
    }
}
export * from './renderer';
