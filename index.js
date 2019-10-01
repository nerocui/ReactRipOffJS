const onStart = () => {
	const Observable = () => {
		const obj = {};
		obj.list = [];
		obj.observers = [];
		const addItem = (item) => {
			obj.list = [...obj.list, item];
			obj.observers.map(observer => {
				observer.receive(obj.list);
			});
		}
		const addObserver = (observer) => {
			obj.observers = [...obj.observers, observer];
		}
		obj.addItem = addItem;
		obj.addObserver = addObserver;
		return obj;
	}

	const Observer = () => {
		const obj = {};
		const setHandler = handler => {
			obj.handler = handler;
		}
		obj.setHandler = setHandler;
		function receive(list) {
			obj.handler(list);
		}
		obj.receive = receive;
		return obj;
	}

	const renderList = (list) => {
		$("#list").html("");
		list.map(item => {
			const li = document.createElement('li');
			$(li).addClass('item');
			$(li).html(item);
			$("#list").append(li);
		});
	}

	const todos = Observable();
	const observer = Observer();

	const onSubmit = (e, input) => {
		e.preventDefault();
		const text = input.value;
		if (!text || text === '') {
			return;
		}
		todos.addItem(text);
		$(input).val('');
	}

	const input = $("#input")[0];
	$("form.addForm").submit(e => onSubmit(e, input));
	observer.setHandler(list => renderList(list));
	todos.addObserver(observer);
	todos.addItem('heheheh');
	todos.addItem("djoaushf");
}

$(document).ready(onStart);
