"use strict";

class Todo {
    constructor(form, input, todoList, todoCompleted, todoContainer, header) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.header = document.querySelector(header);
        this.todoContainer = document.querySelector(todoContainer);
        this.todoData = new Map(JSON.parse(localStorage.getItem("toDoList")));
    }

    addToStorage() {
        localStorage.setItem("toDoList", JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = "";
        this.todoCompleted.textContent = "";
        this.todoData.forEach(item => {
            this.createItem(item);
        });
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        li.setAttribute("key", todo.key);
        li.insertAdjacentHTML("beforeend", `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);
        
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };

            this.todoData.set(newTodo.key, newTodo);   
            
            if (this.header.classList.contains("header-error")) {
                this.header.classList.remove("header-error");
                this.header.classList.add("header-default");
                this.input.placeholder = "Какие планы?";
            }

            this.render();
            this.input.value = "";
        } else if (this.input.value.trim() === "") {
            if (this.header.classList.contains("header-default")) {
                this.header.classList.remove("header-default");
            }
            this.header.classList.add("header-error");
            this.input.placeholder = "Необходимо заполнить поле!";
        }
    }

    generateKey() {
        return `f${(+new Date()).toString(16)}`;
    }

    deleteItem(item) {
        const parentKey = item.closest(".todo-item").getAttribute("key");
        
        this.todoData.delete(parentKey);
        this.addToStorage();
        this.render();
    }

    completeItem(item) {
        const parentKey = item.closest(".todo-item").getAttribute("key");
        
        if (this.todoData.has(parentKey)) {
            if (this.todoData.get(parentKey).completed === false) {
                this.todoData.get(parentKey).completed = true;
            } else {
                this.todoData.get(parentKey).completed = false;
            }

            this.addToStorage();
            this.render();
        }
    }

    handler() {
        this.todoContainer.addEventListener("click", event => {
            let target = event.target;
            
            if (target.matches(".todo-remove")) {
                this.deleteItem(target);
            } else if (target.matches(".todo-complete")) {
                this.completeItem(target);
            }
        });
    }

    init() {
        this.form.addEventListener("submit", this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo(
    ".todo-control",
    ".header-input",
    ".todo-list",
    ".todo-completed",
    ".todo-container",
    ".header"
);

todo.init();

