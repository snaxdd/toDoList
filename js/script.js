"use strict";

const todoControl = document.querySelector(".todo-control"),
    headerInput = document.querySelector(".header-input"),
    todoList = document.querySelector(".todo-list"),
    todoCompleted = document.querySelector(".todo-completed");

const addToStorage = function(obj) {
    const todoJSON = JSON.stringify(obj);
    
    localStorage.setItem("list", todoJSON);
};

const readStorage = function() {
    const returnObj = JSON.parse(localStorage.getItem("list"));

    if (returnObj !== null) {
        return returnObj;
    } else {
        return [];
    }
};

const todoData = readStorage();

const render = function() {
    todoList.textContent = "";
    todoCompleted.textContent = "";
    addToStorage(todoData);

    todoData.forEach(function(item) {
        const li = document.createElement("li");
        li.classList.add("todo-item");

        li.innerHTML = "<span class=\"text-todo\">" + item.value + "</span>" +
            "<div class=\"todo-buttons\">" + 
                "<button class=\"todo-remove\"></button>" + 
                "<button class=\"todo-complete\"></button>" + 
            "</div>";

        if (item.completed) {
            todoCompleted.append(li);
        } else {
            todoList.append(li);
        }
        
        const complete = li.querySelector(".todo-complete"),
            remove = li.querySelector(".todo-remove");

        complete.addEventListener("click", function() {
            item.completed = !item.completed;
            render();
        });
        
        remove.addEventListener("click", function() {
            todoData.splice(todoData.indexOf(item), 1);
            render();
        });
    });
};

todoControl.addEventListener("submit", function(event) {
    event.preventDefault();

    const newTodo = {
        value: headerInput.value,
        completed: false
    };

    if (newTodo.value.trim() !== "") {
        todoData.push(newTodo);
        headerInput.value = "";    
    }
    
    render();
});

render();

