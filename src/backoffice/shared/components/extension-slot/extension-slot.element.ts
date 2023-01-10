import { nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'rxjs';
import { repeat } from 'lit/directives/repeat.js';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';
import { createExtensionElement } from '@umbraco-cms/extensions-api';
import { isManifestElementableType } from 'src/core/extensions-api/is-manifest-elementable-type.function';
import { UmbLitElement } from '@umbraco-cms/element';

type InitializedExtensionItem = { alias: string; weight: number; component: HTMLElement | null };

/**
 * @element umb-extension-slot
 * @description
 * @slot default - slot for inserting additional things into this slot.
 * @export
 * @class UmbExtensionSlot
 * @extends {UmbLitElement}
 */
@customElement('umb-extension-slot')
export class UmbExtensionSlotElement extends UmbLitElement {
	@state()
	private _extensions: InitializedExtensionItem[] = [];

	@property({ type: String })
	public type = '';

	@property({ type: Object, attribute: false })
	public filter: (manifest: any) => boolean = () => true;

	@property({ type: String, attribute: 'default-element' })
	public defaultElement = '';

	connectedCallback(): void {
		super.connectedCallback();
		this._observeExtensions();
	}

	private _observeExtensions() {
		this.observe(
			umbExtensionsRegistry?.extensionsOfType(this.type).pipe(map((extensions) => extensions.filter(this.filter))),
			async (extensions) => {
				const oldLength = this._extensions.length;
				this._extensions = this._extensions.filter((current) =>
					extensions.find((incoming) => incoming.alias === current.alias)
				);
				if (this._extensions.length !== oldLength) {
					this.requestUpdate('_extensions');
				}

				extensions.forEach(async (extension) => {
					const hasExt = this._extensions.find((x) => x.alias === extension.alias);
					if (!hasExt) {
						const extensionObject: InitializedExtensionItem = {
							alias: extension.alias,
							weight: (extension as any).weight || 0,
							component: null,
						};
						this._extensions.push(extensionObject);
						let component;
						if (isManifestElementableType(extension)) {
							component = await createExtensionElement(extension);
						} else {
							component = document.createElement(this.defaultElement);
						}
						if (component) {
							(component as any).manifest = extension;
							extensionObject.component = component;

							// sort:
							// TODO: Make sure its right to have highest last?
							this._extensions.sort((a, b) => a.weight - b.weight);
						} else {
							// Remove cause we could not get the component, so we will get rid of this.
							//this._extensions.splice(this._extensions.indexOf(extensionObject), 1);
							// Actually not, because if, then the same extension would come around again in next update.
						}
						this.requestUpdate('_extensions');
					}
				});
			}
		);
	}

	render() {
		// TODO: check if we can use repeat directly.
		return repeat(
			this._extensions,
			(ext) => ext.alias,
			(ext) => ext.component || nothing
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-extension-slot': UmbExtensionSlotElement;
	}
}