const { rest } = window.MockServiceWorker;
import { RestHandler, MockedRequest, DefaultBodyType } from 'msw';
import { umbScriptsData } from '../data/scripts.data.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';
import { CreatePathFolderRequestModel, CreateTextFileViewModelBaseModel } from '@umbraco-cms/backoffice/backend-api';

const treeHandlers = [
	rest.get(umbracoPath('/tree/script/root'), (req, res, ctx) => {
		const response = umbScriptsData.getTreeRoot();
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath('/tree/script/children'), (req, res, ctx) => {
		const path = req.url.searchParams.get('path');
		if (!path) return;

		const response = umbScriptsData.getTreeItemChildren(path);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath('/tree/script/item'), (req, res, ctx) => {
		const paths = req.url.searchParams.getAll('paths');
		if (!paths) return;

		const items = umbScriptsData.getTreeItem(paths);
		return res(ctx.status(200), ctx.json(items));
	}),
];

const detailHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
	rest.get(umbracoPath('/script'), (req, res, ctx) => {
		const path = decodeURIComponent(req.url.searchParams.get('path') ?? '').replace('-js', '.js');
		if (!path) return res(ctx.status(400));
		const response = umbScriptsData.getScript(path);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath('/script/item'), (req, res, ctx) => {
		const path = decodeURIComponent(req.url.searchParams.get('path') ?? '').replace('-js', '.js');
		if (!path) return res(ctx.status(400, 'no body found'));
		const response = umbScriptsData.getItem([path]);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.post(umbracoPath('/script'), async (req, res, ctx) => {
		const requestBody = (await req.json()) as CreateTextFileViewModelBaseModel;
		if (!requestBody) return res(ctx.status(400, 'no body found'));
		const response = umbScriptsData.insertScript(requestBody);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.delete(umbracoPath('/script'), (req, res, ctx) => {
		const path = req.url.searchParams.get('path');
		if (!path) return res(ctx.status(400));
		const response = umbScriptsData.delete([path]);
		return res(ctx.status(200), ctx.json(response));
	}),
	rest.put(umbracoPath('/script'), async (req, res, ctx) => {
		const requestBody = (await req.json()) as CreateTextFileViewModelBaseModel;
		if (!requestBody) return res(ctx.status(400, 'no body found'));
		const response = umbScriptsData.updateData(requestBody);
		return res(ctx.status(200));
	}),
];

const folderHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
	rest.get(umbracoPath('script/folder'), (req, res, ctx) => {
		const path = decodeURIComponent(req.url.searchParams.get('path') ?? '').replace('-js', '.js');
		if (!path) return res(ctx.status(400));
		const response = umbScriptsData.getFolder(path);
		return res(ctx.status(200), ctx.json(response));
	}),
	rest.post(umbracoPath('script/folder'), (req, res, ctx) => {
		const requestBody = req.json() as CreatePathFolderRequestModel;
		if (!requestBody) return res(ctx.status(400, 'no body found'));
		return res(ctx.status(200));
	}),
	rest.delete(umbracoPath('script/folder'), (req, res, ctx) => {
		const path = decodeURIComponent(req.url.searchParams.get('path') ?? '').replace('-js', '.js');
		if (!path) return res(ctx.status(400));
		const response = umbScriptsData.deleteFolder(path);
		return res(ctx.status(200), ctx.json(response));
	}),
];

export const handlers = [...treeHandlers, ...detailHandlers, ...folderHandlers];
