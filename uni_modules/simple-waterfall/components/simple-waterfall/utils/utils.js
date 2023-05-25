const queryMap = new Map(),
	queryMapMaxSize = 20;
export function querySelector(selector, container, options = {
	size: true,
	rect: true,
	dataset: true
}) {
	return new Promise(resolve => {
		let query;
		const id = container['id'] || container['__wxExparserNodeId__'] || null;
		if (id && queryMap.get(id)) {
			query = queryMap.get(id);
		} else {
			query = uni.createSelectorQuery().in(container).select(selector);
			if (id) {
				queryMap.set(id, query);
			}
		}
		if (queryMap.size > queryMapMaxSize) {
			queryMap.delete(queryMap.keys().toArray()[0]);
		}
		query.fields(options, resolve).exec();
	})
}

export function sleep(ms = 100) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce(func, delay = 200) {
	let timeoutId;
	return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

export function throttle(func, delay = 200) {
	let timerId;
	let lastArgs;

	return function(...args) {
		lastArgs = args;
		if (!timerId) {
			timerId = setTimeout(() => {
				func.apply(this, lastArgs);
				timerId = null;
			}, delay);
		}
	};
}