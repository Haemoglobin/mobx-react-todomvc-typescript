import {observable, computed, reaction, IObservableArray} from 'mobx';
import TodoModel from '../models/TodoModel'
import * as Utils from '../utils';


export default class TodoStore {
	@observable todos: TodoModel[] = [];

	@computed get activeTodoCount() {
		return this.todos.filter(todo => !todo.completed).length;
	}

	@computed get completedCount() {
		return this.todos.length - this.activeTodoCount;
	}

	subscribeServerToStore() {
		reaction(
			() => this.toJS(),
			todos => fetch('/api/todos', {
				method: 'post',
				body: JSON.stringify({ todos }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
	}

	addTodo (title: string) {
		this.todos.push(new TodoModel(this, Utils.uuid(), title, false));
	}

	toggleAll (checked: boolean) {
		this.todos.forEach(
			todo => todo.completed = checked
		);
	}

	removeTodo(todoToRemove: TodoModel) {
		this.todos = this.todos.filter(todo => todo.id !== todoToRemove.id);
	}

	clearCompleted () {
		this.todos = this.todos.filter(todo => !todo.completed);
	}

	toJS() {
		return this.todos.map(todo => todo.toJS());
	}

	static fromJS(array: any) {
		const todoStore = new TodoStore();
		todoStore.todos = array.map((item: any) => TodoModel.fromJS(todoStore, item));
		return todoStore;
	}
}
