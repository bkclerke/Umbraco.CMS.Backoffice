import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('umb-installer-user')
export class UmbInstallerUser extends LitElement {
  static styles: CSSResultGroup = [
    css`
      uui-input,
      uui-input-password {
        width: 100%;
      }
    `,
  ];

  private _handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    if (!form) return;

    const isValid = form.checkValidity();
    if (!isValid) return;

    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const news = formData.has('news');

    this._install(name, email, password, news);
  };

  private async _install(name: string, email: string, password: string, news: boolean) {
    console.log('Installing', name, email, password, news);

    try {
      await fetch('/install', { method: 'POST' });

      // TODO: Change to redirect when router has been added.
      this.dispatchEvent(new CustomEvent('install', { bubbles: true, composed: true }));
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return html` <div class="uui-text">
      <h1 class="uui-h3">Install Umbraco</h1>
      <uui-form>
        <form id="LoginForm" name="login" @submit="${this._handleSubmit}">
          <uui-form-layout-item>
            <uui-label for="name" slot="label" required>Name</uui-label>
            <uui-input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name..."
              required
              required-message="Name is required"></uui-input>
          </uui-form-layout-item>

          <uui-form-layout-item>
            <uui-label for="email" slot="label" required>Email</uui-label>
            <uui-input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email..."
              required
              required-message="Email is required"></uui-input>
          </uui-form-layout-item>

          <uui-form-layout-item>
            <uui-label for="password" slot="label" required>Password</uui-label>
            <uui-input-password
              id="password"
              name="password"
              placeholder="Enter your password..."
              required
              required-message="Password is required"></uui-input-password>
          </uui-form-layout-item>

          <uui-form-layout-item>
            <uui-checkbox name="persist" label="Remember me"> Remember me </uui-checkbox>
          </uui-form-layout-item>

          <uui-button type="submit" label="Customize" look="secondary"></uui-button>
          <uui-button type="submit" label="Install" look="positive"></uui-button>
        </form>
      </uui-form>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'umb-installer-user': UmbInstallerUser;
  }
}