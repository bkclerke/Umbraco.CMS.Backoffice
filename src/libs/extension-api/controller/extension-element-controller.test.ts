import { expect, fixture } from '@open-wc/testing';
import { UmbExtensionRegistry } from '../registry/extension.registry.js';
import { UmbExtensionElementController } from './index.js';
import { UmbControllerHostElement, UmbControllerHostElementMixin } from '@umbraco-cms/backoffice/controller-api';
import { customElement, html } from '@umbraco-cms/backoffice/external/lit';
import { type ManifestSection, UmbSwitchCondition } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-test-controller-host')
export class UmbTestControllerHostElement extends UmbControllerHostElementMixin(HTMLElement) {}

describe('UmbExtensionElementController', () => {
	describe('Manifest without conditions', () => {
		let hostElement: UmbControllerHostElement;
		let extensionRegistry: UmbExtensionRegistry<ManifestSection>;
		let manifest: ManifestSection;

		beforeEach(async () => {
			hostElement = await fixture(html`<umb-test-controller-host></umb-test-controller-host>`);
			extensionRegistry = new UmbExtensionRegistry();
			manifest = {
				type: 'section',
				name: 'test-section-1',
				alias: 'Umb.Test.Section.1',
				elementName: 'section',
				meta: {
					label: 'my section',
					pathname: 'my-section',
				},
			};

			extensionRegistry.register(manifest);
		});

		it('permits when there is no conditions', (done) => {
			let called = false;
			const extensionController = new UmbExtensionElementController(
				hostElement,
				extensionRegistry,
				'Umb.Test.Section.1',
				(permitted) => {
					if (called === false) {
						called = true;
						expect(permitted).to.be.true;
						if (permitted) {
							expect(extensionController?.manifest?.alias).to.eq('Umb.Test.Section.1');
							expect(extensionController.component?.nodeName).to.eq('SECTION');
							done();
							extensionController.destroy();
						}
					}
				}
			);
		});

		it('utilized the default element when there is none provided by manifest', (done) => {
			extensionRegistry.unregister(manifest.alias);

			const noElementManifest = { ...manifest, elementName: undefined };
			extensionRegistry.register(noElementManifest);

			let called = false;
			const extensionController = new UmbExtensionElementController(
				hostElement,
				extensionRegistry,
				'Umb.Test.Section.1',
				(permitted) => {
					if (called === false) {
						called = true;
						expect(permitted).to.be.true;
						if (permitted) {
							expect(extensionController?.manifest?.alias).to.eq('Umb.Test.Section.1');
							expect(extensionController.component?.nodeName).to.eq('UMB-TEST-FALLBACK-ELEMENT');
							done();
							extensionController.destroy();
						}
					}
				},
				'umb-test-fallback-element'
			);
		});
	});

	describe('Manifest with multiple conditions that changes over time', () => {
		let hostElement: UmbControllerHostElement;
		let extensionRegistry: UmbExtensionRegistry<ManifestSection>;
		let manifest: ManifestSection;

		beforeEach(async () => {
			hostElement = await fixture(html`<umb-test-controller-host></umb-test-controller-host>`);
			extensionRegistry = new UmbExtensionRegistry();

			manifest = {
				type: 'section',
				name: 'test-section-1',
				alias: 'Umb.Test.Section.1',
				elementName: 'section',
				conditions: [
					{
						alias: 'Umb.Test.Condition.Delay',
						frequency: '100',
					},
					{
						alias: 'Umb.Test.Condition.Delay',
						frequency: '200',
					},
				],
			} as any;

			// A ASCII timeline for the conditions, when allowed and then not allowed:
			// Condition		 				0ms  100ms  200ms  300ms  400ms  500ms
			// First condition:				-		 +			-		   +      -      +
			// Second condition:			-		 -			+		   +      -      -
			// Sum:										-		 -			-		   +      -      -

			const conditionManifest = {
				type: 'condition',
				name: 'test-condition-delay',
				alias: 'Umb.Test.Condition.Delay',
				class: UmbSwitchCondition,
			};

			extensionRegistry.register(manifest);
			extensionRegistry.register(conditionManifest);
		});

		it('does change permission as conditions change', (done) => {
			let count = 0;
			const extensionController = new UmbExtensionElementController(
				hostElement,
				extensionRegistry,
				'Umb.Test.Section.1',
				async () => {
					count++;
					// We want the controller callback to first fire when conditions are initialized.
					expect(extensionController.manifest?.conditions?.length).to.be.equal(2);
					expect(extensionController?.manifest?.alias).to.eq('Umb.Test.Section.1');
					if (count === 1) {
						expect(extensionController?.permitted).to.be.true;
						expect(extensionController.component?.nodeName).to.eq('SECTION');
					} else if (count === 2) {
						expect(extensionController?.permitted).to.be.false;
						expect(extensionController.component).to.be.undefined;
						done();
						extensionController.destroy(); // need to destroy the controller.
					}
				}
			);
		});
	});
});
