import type { ManifestPropertyEditorModel } from '@umbraco-cms/models';

// TODO: We won't include momentjs anymore so we need to find a way to handle date formats
export const manifest: ManifestPropertyEditorModel = {
	type: 'propertyEditorModel',
	name: 'Date/Time',
	alias: 'Umbraco.TrueFalse',
	meta: {},
};