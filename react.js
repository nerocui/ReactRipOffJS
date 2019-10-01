function CreateObservableApp(initialState = {}) {
	const app = {};
	const store = initialState;
	app.store = store;
	app.observers = [];
	app.reducers = [];
	const addReducer = reducer => {
		app.reducers = [...app.reducers, reducer];
	}
	const reduce = (action) => {
		const newStore = {};
		app.reducers.map(reducer => {
			newStore[reducer.name] = reducer.reduce(action);
		});
		return newStore;
	}

	const dispatch = action => {
		app.store = reduce(action);
		app.observers.map(observer => {
			observer.receive(app.store);
		});
	}
	app.dispatch = dispatch;
	const addObserver = observer => {
		app.observers = [...app.observers, observer];
	}
	return app;
}

function CreateReducer(name, reduce) {
	const reducer = {};
	reducer.name = name;
	reducer.reduce = reduce;
	return reducer;
}

function CreateObserver() {
	const obj = {};
	obj.handlers = [];
	const addHandler = handler => {
		obj.handlers = [...obj.handlers, handler];
	}
	obj.addHandler = addHandler;
	const receive = (store) => {
		obj.handlers.map(handler => {
			handler(store);
		});
	}
	obj.receive = receive;
	return obj;
}


function main() {
	const app = CreateObservableApp({});
	const observer = CreateObserver();


	const input = $("#input")[0];
	$("form.addForm").submit(e => onSubmit(e, input));
	observer.setHandler(list => renderList(list));
	todos.addObserver(observer);
	todos.addItem('heheheh');
	todos.addItem("djoaushf");
}

$(document).ready(main);
