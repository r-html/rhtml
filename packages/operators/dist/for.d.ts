import { LitElement } from '@rxdi/lit-html';
import { Observable } from 'rxjs';
export declare class ForOperator extends LitElement {
    of: any[] | Observable<any[]>;
    OnUpdate(): void;
}
