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
		app.reducers.map(reducer => {
			app.store[reducer.name] = reducer.reduce(app.store[reducer.name], action);
		});
	}

	const dispatch = action => {
		reduce(action);
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
				return Object.assign({}, state, {items: [...items, action.payload]});
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

const renderList = ({list}) => {
	$("#list").html("");
	list.map(item => {
		const li = document.createElement('li');
		$(li).addClass('item');
		$(li).html(item);
		$("#list").append(li);
	});
}

function connect(mapStateToProps, state) {
	return render => {
		const props = mapStateToProps(state);
		return render(props);
	}
}

function mapStateToProps(state) {
	return {
		list: state.ToDoReducer.items,
	};
}

function main() {
	const app = CreateObservableApp(initialState);
	const observer = CreateObserver();
	app.addObserver(observer);
	app.addReducer(CreateToDoReducer());

	const input = $("#input")[0];
	$("form.addForm").submit(e => onSubmit(e, input));
	observer.addHandler((state) => connect(mapStateToProps, state)(renderList));
	addItem(app, 'haha');
	addItem(app, 'hehe');
}

$(document).ready(main);
