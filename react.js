function CreateObservableApp(initialState = {}) {
	const app = {};
	const store = initialState;
	app.store = store;
	app.observers = [];
	app.reducers = [];
	const addReducer = reducer => {
		app.reducers = [...app.reducers, reducer];
	}
	app.addReducer = addReducer;
	const reduce = (action) => {
		const newStore = {};
		app.reducers.map(reducer => {
			newStore[reducer.name] = reducer.reduce(app.store[reducer.name], action);
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
	app.addObserver = addObserver;
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

function CreateToDoReducer() {
	const reducer = {};
	reducer.name = "ToDoReducer";
	const reduce = (state, action) => {
		switch (action.type) {
			case "ADD_ITEM":
				const items = state.items;
				return Object.assign({}, state, [...items, action.payload]);
			default:
				return state;
		}
	}
	reducer.reduce = reduce;
	return reducer;
}


const initialState = {
	ToDoReducer: {
		items: [],
	},
};

function addItem(app, item) {
	app.dispatch({type: "ADD_ITEM", payload: item});
}

function main() {
	const app = CreateObservableApp(initialStates);
	const observer = CreateObserver();
	app.addObserver(observer);
	app.addReducer(CreateToDoReducer());

	const input = $("#input")[0];
	$("form.addForm").submit(e => onSubmit(e, input));
	observer.setHandler(list => renderList(list));
	todos.addObserver(observer);
	todos.addItem('heheheh');
	todos.addItem("djoaushf");
}

$(document).ready(main);
