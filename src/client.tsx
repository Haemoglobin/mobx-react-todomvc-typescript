import TodoStore from './stores/TodoStore';
import ViewStore from './stores/ViewStore';
import React = require('react');
import ReactDOM = require('react-dom');
let w = window as any; 
const initialState = w.initialState && JSON.parse(w.initialState) || {};

var todoStore = TodoStore.fromJS(initialState.todos || []);
var viewStore = new ViewStore();

todoStore.subscribeServerToStore();
const rootElement = document.getElementById('todoapp');
// necessary for hot reloading
let render = () => {
	const TodoApp = require('./components/todoApp').default;
	ReactDOM.render(
		<TodoApp todoStore={todoStore} viewStore={viewStore} />,
		rootElement
	);
};

if ((module as any).hot) {
	const renderApp = render;
	const renderError = (error) => {
		const RedBox = require('redbox-react');
		ReactDOM.render(
			<RedBox error={error} />,
			rootElement
		);
	};
	render = () => {
		try {
			renderApp();
		} catch (error) {
			renderError(error);
		}
	};
	(module as any).hot.accept('./components/todoApp', () => {
		setTimeout(render);
	});
}

render();
