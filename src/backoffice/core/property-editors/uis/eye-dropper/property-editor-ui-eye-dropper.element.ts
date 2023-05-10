import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { UUIColorPickerChangeEvent } from '@umbraco-ui/uui';
import { UmbDataTypePropertyCollection } from '@umbraco-cms/backoffice/data-type';
import { UmbPropertyEditorExtensionElement } from '@umbraco-cms/backoffice/extensions-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

/**
 * @element umb-property-editor-ui-eye-dropper
 */
@customElement('umb-property-editor-ui-eye-dropper')
export class UmbPropertyEditorUIEyeDropperElement extends UmbLitElement implements UmbPropertyEditorExtensionElement {

	@property()
	value = '';

	@state()
	private _opacity = false;

	@state()
	private _swatches: string[] = [];

	@property({ type: Array, attribute: false })
	public set config(config: UmbDataTypePropertyCollection) {
		this._opacity = config.getValueByAlias('showAlpha') ?? false;
		this._swatches = config.getValueByAlias('palette') ?? [];
	}

	private _onChange(event: UUIColorPickerChangeEvent) {
		this.value = event.target.value;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-eye-dropper
			@change="${this._onChange}"
			.swatches=${this._swatches}
			.opacity="${this._opacity}"></umb-input-eye-dropper>`;
	}

	static styles = [UUITextStyles];
}

export default UmbPropertyEditorUIEyeDropperElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-eye-dropper': UmbPropertyEditorUIEyeDropperElement;
	}
}
