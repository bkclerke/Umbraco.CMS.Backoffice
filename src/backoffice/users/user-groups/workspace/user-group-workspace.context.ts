import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import type { UmbUserGroupStore, UmbUserGroupStoreItemType } from 'src/backoffice/users/user-groups/user-group.store';
import { UmbControllerHostInterface } from 'src/core/controller/controller-host.mixin';

const DefaultDataTypeData = {
	key: '',
	name: '',
	icon: '',
	type: 'user-group',
	hasChildren: false,
	parentKey: '',
	sections: [],
	permissions: [],
	users: [],
} as UmbUserGroupStoreItemType;

export class UmbWorkspaceUserGroupContext extends UmbWorkspaceContentContext<
	UmbUserGroupStoreItemType,
	UmbUserGroupStore
> {
	constructor(host: UmbControllerHostInterface) {
		super(host, DefaultDataTypeData, 'umbUserStore', 'userGroup');
	}


	public setPropertyValue(alias: string, value: unknown) {
		throw new Error("setPropertyValue is not implemented for UmbWorkspaceUserGroupContext")
	}
}