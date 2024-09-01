class Workflow {
    constructor(title, urls) {
    this.title = title;
    this.urls = urls;
}
}
// Get references to elements
const createWorkflowBtn = document.getElementById("CreateWorkFlowButton");
const saveWorkflowBtn = document.getElementById("SaveWorkFlowButton");

document.getElementById("CreateWorkFlowButton").addEventListener("click", function() {
    document.getElementById("MainScreen").style.display = "none";
    document.getElementById("EditScreen").style.display = "block";
    const elementToFocus = document.getElementById("WorkflowTitle");
    elementToFocus.focus();
});

function AddUrlClicked(event) {
    const button = event.target;
    // Create a new URL item element
    const newUrlItem = document.createElement('div');
    newUrlItem.classList.add('url-item');

    // Create the input and buttons for the new URL item
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add URL';
    input.classList.add('url-input');
    input.style.width = '250px';

    const plusButton = document.createElement('button');
    plusButton.classList.add('field-icon');
    plusButton.style.width = '50px';
    plusButton.innerHTML = '➕';
    plusButton.addEventListener('click', AddUrlClicked);

    const crossButton = document.createElement('button');
    crossButton.classList.add('field-icon');
    crossButton.style.width = '50px';
    crossButton.innerHTML = '❌';
    crossButton.addEventListener('click', DeleteUrlClicked);

    // Append the input and buttons to the new URL item
    newUrlItem.appendChild(input);
    newUrlItem.appendChild(plusButton);
    newUrlItem.appendChild(crossButton);

    // Insert the new URL item after the clicked button's parent
    button.parentNode.after(newUrlItem);
}

function DeleteUrlClicked(event) {
    const button = event.target;
    if (button.classList.contains('field-icon') && button.textContent === '❌') {
        // Check if there's only one URL item left
        const urlItems = document.querySelectorAll('.url-item');
        if (urlItems.length > 1) {
          button.parentNode.remove();
        }
    }
}

document.getElementById("AddUrlButton").addEventListener("click", AddUrlClicked);

document.getElementById("DeleteUrlButton").addEventListener("click", DeleteUrlClicked);
