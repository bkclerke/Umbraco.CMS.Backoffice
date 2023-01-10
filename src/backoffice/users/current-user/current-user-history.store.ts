import { CreateObservablePart, UniqueBehaviorSubject } from 'src/core/observable-api/unique-behavior-subject';

export type UmbModelType = 'dialog' | 'sidebar';

export type UmbCurrentUserHistoryItem = {
	path: string;
	label: string | Array<string>;
	icon?: string;
};

export class UmbCurrentUserHistoryStore {
	
	#history = new UniqueBehaviorSubject(
		<Array<UmbCurrentUserHistoryItem>>[]
	);

	public readonly history = this.#history.asObservable();
	public readonly latestHistory = CreateObservablePart(this.#history, historyItems => historyItems.slice(-10));


	constructor() {
		if (!('navigation' in window)) return;
		(window as any).navigation.addEventListener('navigate', (event: any) => {
			const url = new URL(event.destination.url);
			const historyItem = { path: url.pathname, label: event.destination.url.split('/').pop() };
			this.push(historyItem);
		});
	}

	/**
	 * Pushes a new history item to the history array
	 * @public
	 * @param {UmbCurrentUserHistoryItem} historyItem
	 * @memberof UmbHistoryService
	 */
	public push(historyItem: UmbCurrentUserHistoryItem): void {
		const history = this.#history.getValue();
		const lastItem = history[history.length - 1];

		// This prevents duplicate entries in the history array.
		if (!lastItem || lastItem.path !== historyItem.path) {
			this.#history.next([...this.#history.getValue(), historyItem]);
		} else {
			//Update existing item
			const newHistory = this.#history.getValue();
			newHistory[history.length - 1] = historyItem;
			this.#history.next(newHistory);
		}
	}

	/**
	 * Clears the history array
	 * @public
	 * @memberof UmbHistoryService
	 */
	public clear() {
		this.#history.next([]);
	}
}