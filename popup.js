class Workflow {
    // Constructor to initialize the name and URLs list
    constructor(name, urls = []) {
      this.name = name; // A string variable to hold the name
      this.urls = urls; // A list of strings to hold URLs
    }
  
    // Method to add a URL to the list
    addUrl(url) {
      if (typeof url === 'string' && url.trim() !== '') {
        this.urls.push(url); // Add valid URL to the list
      }
    }
  
    // Method to remove a URL from the list by index
    removeUrl(index) {
      if (index >= 0 && index < this.urls.length) {
        this.urls.splice(index, 1); // Remove the URL at the given index
      } else {
        console.error("Invalid index");
      }
    }
}

var Workflows = []
// Get references to elements
const createWorkflowBtn = document.getElementById("CreateWorkFlowButton");
const saveWorkflowBtn = document.getElementById("SaveWorkFlowButton");

document.getElementById("CreateWorkFlowButton").addEventListener("click", function() {
    document.getElementById("MainScreen").style.display = "none";
    document.getElementById("EditScreen").style.display = "block";
    const elementToFocus = document.getElementById("WorkflowTitle");
    elementToFocus.focus();
});

document.getElementById("SaveWorkFlowButton").addEventListener("click", function() {
    
    const workflowName = document.getElementById('WorkflowTitle').textContent;
    const statusBar = document.getElementById('StatusBar');
    const workflow = new Workflow(workflowName);
    const urlInputs = document.querySelectorAll('#UrlList .url-input');
        urlInputs.forEach((input, index) => {
        workflow.addUrl(input.value);
    });

    if (workflow.urls.length > 0){
        Workflows.push(workflow);
        ShowStatusMessage(`${workflow.urls.length} urls added to ${workflowName}, Total Workflows: ${Workflows.length}`);
    }
    else{
        ShowStatusMessage(`Unable to create workflow as no valid url found!`);
    }

    document.getElementById("MainScreen").style.display = "block";
    document.getElementById("EditScreen").style.display = "none";
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


function ShowStatusMessage(message) {
    const statusBar = document.getElementById('StatusBar');
    statusBar.textContent = message;
    statusBar.style.display = 'inline';
    // Set a timeout to hide the label after 3 seconds (3000 milliseconds)
    setTimeout(() => {
        statusBar.style.display = 'none'; // Hides the label
    }, 2000);
  }