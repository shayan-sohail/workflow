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

document.getElementById("CreateWorkFlowButton").addEventListener("click", function() {
    document.getElementById("MainScreen").style.display = "none";
    document.getElementById("EditScreen").style.display = "block";
    workflowTitle = document.getElementById("WorkflowTitle");

    workflowTitle.value = '';
    const urlList = document.querySelector('.url-list');
    urlList.innerHTML = ''; // Clears all the child elements inside the .url-list

    const newUrlItem = document.createElement('div');
    newUrlItem.classList.add('list-item');

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
    urlList.appendChild(newUrlItem);

    const elementToFocus = document.getElementById("WorkflowTitle");
    elementToFocus.focus();
});

//Backspace shortcut to go back to main screen

document.getElementById("SaveWorkFlowButton").addEventListener("click", function() {
    
    const workflowName = document.getElementById('WorkflowTitle').value;
    if (workflowName === "")
    {
        ShowStatusMessage(`Please enter workflow name`);
        return;
    }
    for (var i = 0; i < Workflows.length; i++)
    {
        if (Workflows[i].name == workflowName)
        {
            ShowStatusMessage(`Workflow with name ${workflowName} already exists`);
            return;
        }
    }

    const introText = document.getElementById('IntroText');
    const workflow = new Workflow(workflowName);
    const urlInputs = document.querySelectorAll('#UrlList .url-input');
        urlInputs.forEach((input, index) => {
        //Validate here
        workflow.addUrl(input.value);
    });

    if (workflow.urls.length > 0){
        Workflows.push(workflow);
        SyncWorkflows();
        ShowStatusMessage(`${workflow.urls.length} urls added to ${workflowName}, Total Workflows: ${Workflows.length}`);
    }
    else{
        ShowStatusMessage(`Unable to create workflow as no valid url found!`);
        return;
    }

    if (Workflows.length > 0)
        introText.style.display = "none";
    else
        introText.style.display = "inline";
    
    document.getElementById("MainScreen").style.display = "block";
    document.getElementById("EditScreen").style.display = "none";
});

function SyncWorkflows()
{
    const workflowList = document.querySelector('.workflow-list');
    workflowList.innerHTML = ''; // Clears all the child elements inside the .url-list

    Workflows.forEach(workflow => {
        // Create a new div with the class 'url-item'
        const workflowItem = document.createElement('div');
        workflowItem.className = 'list-item';
    
        // Create the button element for the workflow name
        const workflowButton = document.createElement('button');
        workflowButton.style = 'width: 200px; text-align: left; padding-left: 5px; color: #b3b3b3;';
        workflowButton.textContent = workflow.name;
        workflowButton.addEventListener('click', OpenWorkflowClicked);
    
        // Create the edit button
        const editButton = document.createElement('button');
        editButton.className = 'field-icon';
        editButton.id = 'EditWorkflowButton';
        editButton.style = 'width: 30px';
        editButton.textContent = '✏️'; // Edit icon
        editButton.addEventListener('click', EditWorkflowClicked); // Edit icon
    
        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'field-icon';
        deleteButton.id = 'DeleteWorkflowButton';
        deleteButton.style = 'width: 30px';
        deleteButton.textContent = '❌'; // Delete icon
        deleteButton.addEventListener('click', DeleteWorkflowClicked);
        
        // Append the buttons to the url-item div
        workflowItem.appendChild(workflowButton);
        workflowItem.appendChild(editButton);
        workflowItem.appendChild(deleteButton);
    
        // Append the url-item div to the url-list container
        workflowList.appendChild(workflowItem);
      });
}

function OpenWorkflowClicked(event)
{
    alert('Open Workflow Clicked');
}
function EditWorkflowClicked(event)
{
    alert('Edit Workflow Clicked');
}
function DeleteWorkflowClicked(event)
{
    alert('Delete Workflow Clicked');
}

function AddUrlClicked(event) {
    const button = event.target;
    // Create a new URL item element
    const newUrlItem = document.createElement('div');
    newUrlItem.classList.add('list-item');

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
        const urlItems = document.querySelectorAll('.list-item');
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