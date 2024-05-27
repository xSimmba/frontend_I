export default class TodoModel {
    #tasks = [
        {
            title: "Task 1",
            items: [
                {
                    title: "Item 1",
                    checked: "false"
                },
                {
                    title: "Item 2",
                    checked: "false"
                },
                {
                    title: "Item 3",
                    checked: "false"
                }
            ]
        }
    ];

    constructor() {

        if(!localStorage.getItem("todos")){ 
            localStorage.setItem("todos", JSON.stringify(this.#tasks));
        }
    }


    /** TASKS */
    addTask(task) {
        this.#tasks.push(task);
        this.#updateLocalStorage();
    }
    deleteTask(index) {
        this.#tasks.splice(index, 1);
        this.#updateLocalStorage();
    }
    getTasks() {
        return JSON.parse(localStorage.getItem("todos"));
    }

    
    /** TASKS */

    addItem(taskIndex, item){
        this.#tasks[taskIndex].items.push(item);
        this.#updateLocalStorage();
    }
    deleteItem(taskIndex, itemIndex){
        
        this.#tasks(taskIndex).items.splice(itemIndex);
        this.#updateLocalStorage();
    }
    updateItem(taskIndex, itemIndex, val){
        this.#tasks[taskIndex].items[itemIndex].checked = val;
        this.#updateLocalStorage();
    }
    getItems(taskIndex){
        return this.#tasks[taskIndex].items;
    }


    #updateLocalStorage() {
        localStorage.setItem("todos", JSON.stringify(this.#tasks));
    }

}