import { Hydrate } from '@rhtml/experiments';
import { html, LitElement } from '@rxdi/lit-html';

import { IUser, UserService } from './user.service';

interface IState {
  loading: boolean;
  userId: number;
  user: IUser;
}

const UserProfile = html`
  <r-component>
    <r-selector>user-profile</r-selector>
    <r-props>
      <r-prop key="userId" type="String"></r-prop>
    </r-props>
    <r-render
      .state=${(
        { loading, userId, user = {} }: IState,
        setState: (s: IState) => void
      ) => html`
        <user-service
          .run=${async function (this: UserService) {
            setState({
              userId,
              user: await this.getUserById(userId),
              loading: false,
            });
          }}
        ></user-service>
        <r-if .exp=${loading}> Loading... </r-if>
        <r-if .exp=${!loading}>
          <p>User id: ${user.id}</p>
          <p>User name: ${user.name}</p>
        </r-if>
      `}
    >
    </r-render>
  </r-component>
`;

Hydrate(UserProfile);

export declare class UserProfileComponent extends LitElement {
  userId: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'user-profile': UserProfileComponent;
  }
}
