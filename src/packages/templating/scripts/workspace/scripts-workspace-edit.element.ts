import { UmbScriptsWorkspaceContext } from './scripts-workspace.context.js';
import type { UmbCodeEditorElement } from '@umbraco-cms/backoffice/code-editor';
import { UUITextStyles, UUIInputElement } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, query, state, PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UMB_MODAL_MANAGER_CONTEXT_TOKEN, UmbModalManagerContext } from '@umbraco-cms/backoffice/modal';
import { Subject, debounceTime } from '@umbraco-cms/backoffice/external/rxjs';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import _ from 'lodash';

@customElement('umb-scripts-workspace-edit')
export class UmbScriptsWorkspaceEditElement extends UmbLitElement {
	#name: string | undefined = '';
	@state()
	private get _name() {
		return this.#name;
	}

	private set _name(value) {
		this.#name = value?.replace('.js', '');
		this.requestUpdate();
	}

	@state()
	private _content?: string | null = '';

	@state()
	private _path?: string | null = '';

	@state()
	private _dirName?: string | null = '';

	@state()
	private _ready?: boolean = false;

	@query('umb-code-editor')
	private _codeEditor?: UmbCodeEditorElement;

	#scriptsWorkspaceContext?: UmbScriptsWorkspaceContext;
	private _modalContext?: UmbModalManagerContext;

	#isNew = false;

	private inputQuery$ = new Subject<string>();

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});

		this.consumeContext(UMB_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.#scriptsWorkspaceContext = workspaceContext as UmbScriptsWorkspaceContext;
			this.observe(this.#scriptsWorkspaceContext.name, (name) => {
				this._name = name;
			});

			this.observe(this.#scriptsWorkspaceContext.content, (content) => {
				this._content = content;
			});

			this.observe(this.#scriptsWorkspaceContext.path, (path) => {
				this._path = path;
			});

			this.observe(this.#scriptsWorkspaceContext.isNew, (isNew) => {
				this.#isNew = !!isNew;
			});

			this.observe(this.#scriptsWorkspaceContext.isCodeEditorReady, (isReady) => {
				this._ready = isReady;
			});

			this.inputQuery$.pipe(debounceTime(250)).subscribe((nameInputValue: string) => {
				this.#scriptsWorkspaceContext?.setName(`${nameInputValue}.js`);
			});
		});
	}

	protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		if (_changedProperties.has('_path')) {
			this._dirName = this._path?.substring(0, this._path?.lastIndexOf('/'));
		}
	}

	#onNameInput(event: Event) {
		const target = event.target as UUIInputElement;
		const value = target.value as string;
		this.inputQuery$.next(value);
	}

	#onCodeEditorInput(event: Event) {
		const target = event.target as UmbCodeEditorElement;
		const value = target.code as string;
		this.#scriptsWorkspaceContext?.setContent(value);
	}

	#renderCodeEditor() {
		return html`<umb-code-editor
			language="javascript"
			id="content"
			.code=${this._content ?? ''}
			@input=${this.#onCodeEditorInput}></umb-code-editor>`;
	}

	render() {
		return html`<umb-workspace-editor alias="Umb.Workspace.Scripts">
			<div id="workspace-header" slot="header">
				<uui-input
					placeholder="Enter name..."
					.value=${this._name}
					@input=${this.#onNameInput}
					label="template name"></uui-input>
				<small>Scripts/${this._dirName}${this._name}.js</small>
			</div>
			<uui-box>
				<!-- the div below in the header is to make the box display nicely with code editor -->
				<div slot="header"></div>
				${this._ready
					? this.#renderCodeEditor()
					: html`<div id="loader-container">
							<uui-loader></uui-loader>
					  </div>`}
			</uui-box>
			<div slot="footer-info">
				<!-- TODO: Shortcuts Modal? -->
				<uui-button label="Show keyboard shortcuts">
					Keyboard Shortcuts
					<uui-keyboard-shortcut>
						<uui-key>ALT</uui-key>
						+
						<uui-key>shift</uui-key>
						+
						<uui-key>k</uui-key>
					</uui-keyboard-shortcut>
				</uui-button>
			</div>
		</umb-workspace-editor>`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
			}

			#loader-container {
				display: grid;
				place-items: center;
				min-height: calc(100dvh - 260px);
			}

			umb-code-editor {
				--editor-height: calc(100dvh - 260px);
			}

			uui-box {
				min-height: calc(100dvh - 260px);
				margin: var(--uui-size-layout-1);
				--uui-box-default-padding: 0;
				/* remove header border bottom as code editor looks better in this box */
				--uui-color-divider-standalone: transparent;
			}

			#workspace-header {
				width: 100%;
			}

			uui-input {
				width: 100%;
			}
		`,
	];
}

export default UmbScriptsWorkspaceEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-scripts-workspace-edit': UmbScriptsWorkspaceEditElement;
	}
}
