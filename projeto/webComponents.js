/**TODO HEADER */
const headerTemplate = document.createElement("template");
headerTemplate.innerHTML = `
<style>
    @import url("system.css");
    :host {
        background-color: var(--color-primary);
    }

    header {
        display: flex;
        align-items: center;
        gap: var(--gap);
        padding: var(--v-padding) var(--h-padding);
    }
    header * {
        padding: 0;
        margin: 0;
    }

    h1 {
        color: var(--color-text-light);
        font-size: clamp(32px, 4vw, 48px);
    }
    p {
        display: none;
        font-size: clamp(16px, 4vw, 24px);
        color: var(--color-text-dark);
        font-style: italic;
        text-transform: capitalize;
    }

    .icon {
        display: none;
        width: clamp(32px, 4vw, 48px);
        height: clamp(32px, 4vw, 48px);
        min-width: 32px;
        min-height: 32px;
        cursor: pointer;
        margin-left: auto
    }
</style>

<header>

<h1>TODOs</h1>
<p>Task name</p>
<div class="icon">
    <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-light)">
        <path d="m9.5578 24.342h-9.5578v-14.193l12.171-10.149 12.171 10.149v14.193h-9.5578v-7.5914h-5.226z" />
    </svg>
</div>

</header>

`;
class TodoHeader extends HTMLElement {

    static observedAttributes = ['state', 'task-name'];
    shadowRoot;
    #taskName;
    #icon;
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'closed'});
        this.shadowRoot.append(headerTemplate.content.cloneNode(true));

        this.#taskName = this.shadowRoot.querySelector("p");
        this.#icon = this.shadowRoot.querySelector(".icon");

        this.#icon.onclick = () => this.dispatchEvent(new CustomEvent("clicked"));

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            this.dispatchEvent(new CustomEvent("clicked"));
          }
        });

    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case 'state':
                if(newVal === "tasks") {
                    this.#taskName.style.display = "none";
                    this.#icon.style.display = "none";
                } else {
                    this.#taskName.style.display = "initial";
                    this.#icon.style.display = "initial";
                }
                break;
            case 'task-name':
                this.#taskName.innerText = newVal;
                break;
        }
    }

    get state() {
        return this.getAttribute("state");
    }
    set state(val) {
        this.setAttribute("state", val);
    }

    get taskName() {
        return this.getAttribute("task-name");
    }
    set taskName(val) {
        this.setAttribute("task-name", val);
    }
}
customElements.define("todo-header", TodoHeader);


/** ITEM */
class Item extends HTMLElement {

    shadowRoot;
    button;
    front;
    #touchX;
    #maxX = 84;
    #currentX;

    constructor() {
        super();

        this.shadowRoot = this.attachShadow({mode:'closed'});
    }

    initialize() {

        this.button = this.shadowRoot.querySelector(".button");
        this.front = this.shadowRoot.querySelector(".front");

        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);

        this.button.onmousedown = (ev) => this.#mouseDown(ev);
        this.button.onclick = () => {
            if(this.#currentX === 0) this.dispatchEvent(new CustomEvent("clicked"));
        }
    }

    #mouseDown(ev) {

        this.#touchX = ev.x
        document.addEventListener("mouseup", this.mouseUp);
        document.addEventListener("mousemove", this.mouseMove);
        this.front.style.transition = 'none';
        this.#currentX = 0;
    }

    mouseUp() {

        document.removeEventListener("mouseup", this.mouseUp);
        document.removeEventListener("mousemove", this.mouseMove);

        if(this.#currentX === this.#maxX) this.dispatchEvent(new CustomEvent("delete"));

        this.front.style.transition = 'transform .15s ease-in-out';
        this.front.style.transform = 'translateX(0)';

        this.#touchX = 0;
    }
    mouseMove(ev) {

        this.#currentX = this.#touchX - ev.x;
        if(this.#currentX < 0) this.#currentX = 0;
        if(this.#currentX > this.#maxX) this.#currentX = this.#maxX;

        this.front.style.transform = `translateX(-${this.#currentX}px)`;
    }
}


/**TASK ITEM */
const taskItemTemplate = document.createElement("template");
taskItemTemplate.innerHTML = `

<style>
    @import url("system.css");

    .button {
        position: relative;
        overflow: hidden;
        width: 100%;
        cursor: pointer;
    }

    .button:active .front label,
    .button:active .front .icon {
        transform: scale(0.9);
    }

    .front {
        position: absolute;
        display: flex;
        inset: 0;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
        background-color: #dddddd;
        padding: 20px;
        transition: transform 0.3s ease-in-out;
    }

    label {
        font-size: clamp(32px, 4vw, 48px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        color: var(--color-text-dark);
    }

    .icon {
        width: clamp(32px, 4vw, 48px);
        height: clamp(32px, 4vw, 48px);
        min-width: 32px;
        min-height: 32px;
    }

    .back {
        display: flex;
        justify-content: flex-end;
        background-color: var(--color-secondary);
        padding: 20px;
    }
</style>
<div class="button">
    <div class="front">
        <label></label>
        <div class="icon">
            <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-dark)">
                <path
                    d="m12.164 3.25e-7 12.177 12.171-12.177 12.171-3.6954-3.6954 5.8624-5.8624h-14.331v-5.226h14.331l-5.8624-5.8624z" />
            </svg>
        </div>
    </div>

    <div class="back">
        <div class="icon">
            <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-light)">
                <path
                    d="m12.171 8.4754-8.4754-8.4754-3.6954 3.6954 8.4754 8.4754-8.4754 8.4754 3.6954 3.6954 8.4754-8.4754 8.4754 8.4754 3.6954-3.6954-8.4754-8.4754 8.4754-8.4754-3.6954-3.6954z" />
            </svg>
        </div>
    </div>

</div>


`
class TaskItem extends Item {

    static observedAttributes = ['title'];
    constructor() {
        super();

        this.shadowRoot.append(taskItemTemplate.content.cloneNode(true));
        this.initialize();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        if(attrName === "title") {
            this.shadowRoot.querySelector("label").innerText = newVal;
        }
    }


    get title() {
        return this.getAttribute("title");
    }
    set title(val) {
        this.setAttribute("title", val);
    }
}
customElements.define("task-item", TaskItem); 

/**CHECK ITEM */
const checkItemTemplate = document.createElement("template");
checkItemTemplate.innerHTML = `
<style>
    @import url("system.css");

    .button {
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    .front {
        position: absolute;
        display: flex;
        inset: 0;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-text-dark);
        padding: 20px;
        transition: transform 0.3s ease-in-out;
    }

    label {
        font-size: clamp(32px, 4vw, 48px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        color: var(--color-text-light);
    }

    .icon {
        width: clamp(32px, 4vw, 48px);
        height: clamp(32px, 4vw, 48px);
        min-width: 32px;
        min-height: 32px;
    }
    .checkbox {
        background-color: var(--color-text-light);
        padding: 5px;
        cursor: pointer;
    }
    .checkbox svg {
        display: none;
    }

    .back {
        display: flex;
        justify-content: flex-end;
        background-color: var(--color-secondary);
        padding: 20px;
    }
</style>
<div class="button">
    <div class="front">
        <label></label>
        <div class="checkbox icon">
            <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-dark)">
                <path d="m20.497 2.6458 3.8447 3.865-15.105 15.185-9.2366-9.2856 3.8447-3.865 5.3919 5.4205z"/>
            </svg>
        </div>
    </div>

    <div class="back">
        <div class="icon">
            <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-light)">
                <path
                    d="m12.171 8.4754-8.4754-8.4754-3.6954 3.6954 8.4754 8.4754-8.4754 8.4754 3.6954 3.6954 8.4754-8.4754 8.4754 8.4754 3.6954-3.6954-8.4754-8.4754 8.4754-8.4754-3.6954-3.6954z" />
            </svg>
        </div>
    </div>

</div>
`;

class CheckItem extends Item {

    static observedAttributes = ['title', 'checked'];

    #checkbox;
    #checkicon;
    #isChecked;
    constructor() {
        super();
        
        this.shadowRoot.append(checkItemTemplate.content.cloneNode(true));

        this.#checkbox = this.shadowRoot.querySelector(".checkbox");
        this.#checkicon = this.#checkbox.querySelector("svg");

        this.#checkbox.onclick = () => {

            this.#isChecked = this.#isChecked === "true" ? "false" : "true";

            this.dispatchEvent(new CustomEvent("checked", {detail: {
                checked: this.#isChecked
            }}));

            this.#checkicon.style.display = this.#isChecked === "true" ? "block" : "none";
        }

        this.initialize();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case 'title':
                this.shadowRoot.querySelector("label").innerText = newVal;
                break;
            case 'checked':
                this.#isChecked = newVal;
                this.#checkicon.style.display = this.#isChecked === "true" ? "block" : "none";
                break;
        
            default:
                break;
        }
    }

    get checked() {
        return this.getAttribute("checked");
    }

    set checked(val) {
        this.setAttribute("checked", val);
    }

    get title() {
        return this.getAttribute("title");
    }
    set title(val) {
        this.setAttribute("title", val);
    }
}
customElements.define("check-item", CheckItem);


/**TODO MODAL */
const todoModalTemplate = document.createElement("template");
todoModalTemplate.innerHTML = `
<style>
    @import url("system.css");

    :host, #overlay {
        position: absolute;
        inset: 0;
    }

    :host {
        display: none;
        justify-content: center;
        align-items: center;
    }

    #overlay {
        background-color: var(--color-text-dark);
        mix-blend-mode: multiply;
        backdrop-filter: blur(3px);
        
        transition: opacity var(--speed) ease-in-out;
    }

    #dialog {
        display: flex;
        width: 100%;
        max-width: 400px;
        flex-direction: column;
        position: absolute;
        background-color: var(--color-primary);
        padding: var(--v-padding) var(--h-padding);
        gap: var(--gap);
        filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.5));
        transition: transform var(--speed) ease-in-out, opacity var(--speed) ease;
        transform: translateY(50px);
    }

    h2, input {
        margin: 0;
        color: var(--color-text-dark);
    }
    h2 {
        font-size: 42px;
        font-weight: 500;
    }

    input {
        flex: 1;
        border: 1px solid var(--color-text-dark);
        padding: 15px 10px;
        font-size: 18px;
    }
    input:focus{
        outline: none;
    }

    #actions-container {
        display: flex;
        justify-content: flex-end;
        gap: var(--gap);
        flex: 1;
        margin-top: 20px;
    }

    button {
        border: none;
        flex: 1;
        background-color: transparent;
        height: 48px;
        padding: 10px;
        cursor: pointer;
    }
    button:active svg {
        transform: scale(0.9);
    }
    #confirm {
        background-color: var(--color-terciary);
    }

</style>

<div id="overlay"></div>

<div id="dialog">
    <h2>Modal Title</h2>
    <input type="text">
    <div id="actions-container">
        <button id="cancel">
            <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-dark)">
                <path d="m12.171 8.4754-8.4754-8.4754-3.6954 3.6954 8.4754 8.4754-8.4754 8.4754 3.6954 3.6954 8.4754-8.4754 8.4754 8.4754 3.6954-3.6954-8.4754-8.4754 8.4754-8.4754-3.6954-3.6954z"/>
            </svg>
        </button>
        <button id="confirm">
            <svg width="100%" height="100%" viewBox="0 0 24.342 24.342" fill="var(--color-text-light)">
                <path d="m20.497 2.6458 3.8447 3.865-15.105 15.185-9.2366-9.2856 3.8447-3.865 5.3919 5.4205z"/>
            </svg>
        </button>
    </div>
</div>  
`;

class TodoModal extends HTMLElement {
    shadowRoot;
    constructor() {
        super();

        this.shadowRoot = this.attachShadow({mode: "closed"});
        this.shadowRoot.append(todoModalTemplate.content.cloneNode(true));

        this.shadowRoot.querySelector("#overlay").onclick = () => {
            this.hide();
        }
        this.shadowRoot.querySelector("#cancel").onclick = () => {
            this.hide();
        }

        const input = this.shadowRoot.querySelector("input");
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                if (input.value.trim() !== "") {
                    this.dispatchEvent(new CustomEvent("confirm", {
                        detail: {
                            value: input.value
                        }
                    }));
                    this.hide();
                }
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.hide();
            }
        });


        this.shadowRoot.querySelector("#confirm").onclick = () => {
            if(input.value.trim() === "") return;

            this.dispatchEvent(new CustomEvent("confirm", {
                detail: {
                    value: input.value
                }
            }));
            this.hide();
        }
    }

    show(state) {

        let title;
        if(state === "tasks") {
            title = "Add Task";
        } else {
            title = "Add Item";
        }
        this.shadowRoot.querySelector("h2").innerText = title;
        this.style.display = "flex";
    }

    hide() {
        this.shadowRoot.querySelector("input").value = "";
        this.style.display = "none";
    }
}
customElements.define("todo-modal", TodoModal);