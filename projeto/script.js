import TodoModel from "./TodoModel.js";

window.onload = async () => {

    let currentTaskIndex;

    const model = new TodoModel();

    // O teu código aqui...
    const listsContainer = document.querySelector("#lists-container");
    const lists = document.querySelectorAll("ul");
    lists.forEach(ul => {
        ul.style.height = `${listsContainer.offsetHeight}px`;
    });
    const todoHeader = document.querySelector("todo-header");
    todoHeader.state = "tasks";
    todoHeader.addEventListener("clicked", () => {
        listsContainer.style.transform = "translateX(0)";
        todoHeader.state = "tasks";
        buildTasksList(model.getTasks());
    });

    //MODAL
    const todoModal = document.querySelector("todo-modal");
    todoModal.addEventListener("confirm", (ev) => {
        if(todoHeader.getAttribute("state") === "tasks") {
            model.addTask(ev.detail.value);
            buildTasksList(model.getTasks());
        } else {
            console.log(currentTaskIndex);
            model.addItem(currentTaskIndex, ev.detail.value);
            buildItemsList(model.getItems(currentTaskIndex));
        }
    })


    //FOOTER
    const footer = document.querySelector("footer");
    footer.onclick = () => {
        todoModal.show(todoHeader.getAttribute("state"));
    }

    
    const buildTasksList = (tasks) => {

        const ul = document.querySelector("#tasks");
        ul.innerHTML="";
        if(items.length === 0){
            ul.innerHTML="<li> Add an Tasl</li>"
        }

        const tasksList = document.querySelector("#tasks");
        tasksList.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            const taskItem = new TaskItem();
            taskItem.addEventListener("clicked", () => {
                listsContainer.style.transform = "translateX(-100%)";
                todoHeader.state = "items";
                todoHeader.taskName = task.title;
                buildItemsList(task.items);
                currentTaskIndex = index;
            });
            taskItem.addEventListener("delete", () => {
                model.deleteTask(index);
                buildTasksList(model.getTasks());
            });
            taskItem.title = task.title;

            li.append(taskItem);
            tasksList.append(li);
        });

    }

    const buildItemsList = (items) => {

        const ul = document.querySelector("#items");
        ul.innerHTML="";
        if(items.length === 0){
            ul.innerHTML="<li> Add an Item</li>"
        }

        const checkItemsList = document.querySelector("#items");
        checkItemsList.innerHTML = "";
        items.forEach((item, index) => {
            const li = document.createElement("li");
            const checkItem = new CheckItem();
            checkItem.addEventListener("checked", (ev) => {
                model.updateItem(currentTaskIndex, index, ev.detail.checked);
            });
            checkItem.addEventListener("delete", () => {
                model.deleteItem(currentTaskIndex, index);
                buildItemsList(model.getItems(currentTaskIndex));
            });
            checkItem.title = item.title;
            checkItem.checked = item.checked;

            li.append(checkItem);
            checkItemsList.append(li);
            
        });
    }

    buildTasksList(model.getTasks());
}
