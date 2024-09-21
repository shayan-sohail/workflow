class Workflow {
    // Constructor to initialize the name and URLs list
    constructor(name, urls = []) {
      this.name = name; // A string variable to hold the name
      this.urls = urls; // A list of strings to hold URLs
      this.editFlag = false;
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

function CreateWorkflowFromOpenedTabs() {
    
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const workflow = new Workflow(""); // Initialize or update the workflow object here
    
        if (tabs && tabs.length > 0) {
            tabs.forEach((tab) => {
                workflow.urls.push(tab.url);
                console.log(`Tab ID: ${tab.id}, Title: ${tab.title}, URL: ${tab.url}`);
            });
    
            // Call ImportWorkflowClicked after the tabs are processed
            LoadOpenedTabs(workflow);
        } else {
            console.log("No tabs open in the current window.");
    
            // Still call ImportWorkflowClicked, in case there are no tabs
            LoadOpenedTabs(workflow);
        }
    });    
}

document.getElementById("CreateWorkFlowButton").addEventListener("click", function() {

    document.getElementById("MainScreen").style.display = "none";
    document.getElementById("EditScreen").style.display = "block";
    PopulateEditScreen();
});

document.getElementById("SaveWorkFlowButton").addEventListener("click", function() {
    
    const workflowName = document.getElementById('WorkflowTitle').value;
    if (workflowName === "")
    {
        ShowStatusMessage(`Please enter workflow name`);
        return;
    }
    var editFlag = false;
    var editIndex = -1;
    for (var i = 0; i < Workflows.length; i++)
    {
        if (Workflows[i].name == workflowName)
        {
            if (Workflows[i].editFlag != true)
            {
                ShowStatusMessage(`Workflow with name ${workflowName} already exists`);
                return;
            }
            else
            {
                editFlag = true;
                editIndex = i;
                Workflows.splice(i, 1);
            }
        }
    }

    const introText = document.getElementById('IntroText');
    const workflow = new Workflow(workflowName);
    var invalidUrlCount = 0
    const urlInputs = document.querySelectorAll('#UrlList .url-input');
        urlInputs.forEach((input, index) => {
        //Validate here
        if (isValidUrl(input.value)){
            workflow.addUrl(input.value);
        }else{
            invalidUrlCount = invalidUrlCount + 1;
        }
    });

    if (workflow.urls.length > 0){
        if (editFlag)
        {
            Workflows.splice(editIndex, 0, workflow);
        } else {
            Workflows.push(workflow);
        }
        SyncWorkflows();
        ShowStatusMessage(`${workflow.urls.length} urls added to ${workflowName}, Invalid URLs: ${invalidUrlCount}`);
    }
    else{
        ShowStatusMessage(`Unable to create workflow as no valid url found!`);
        return;
    }

    if (Workflows.length > 0)
        introText.style.display = "none";
    else
        introText.style.display = "block";
    
    SaveWorkflowsToStorage();
    document.getElementById("MainScreen").style.display = "block";
    document.getElementById("EditScreen").style.display = "none";
});

document.getElementById("SaveWorkflowsAsFileButton").addEventListener("click", function() {
    const filteredWorkflows = Workflows.map(workflow => ({
        name: workflow.name,
        urls: workflow.urls
    }));

    // Convert the filtered array of Workflow objects to JSON
    const jsonData = JSON.stringify(filteredWorkflows, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create an anchor element and trigger the download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Workflow.json";
    a.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(a.href);
});

document.getElementById("LoadWorkflowsFromFileButton").addEventListener("click", function() {

    var newWorkflowsAddedCount = 0;
    LoadWorkflowsFromFile().then(workflows => {
        console.log('Workflows loaded:', workflows);
        workflows.forEach(workflow => {
            const isPresent = Workflows.some(x => x.name === workflow.name);
            if (!isPresent) {
                // Add the workflow if it's not already present in the global list
                console.log(`Added new workflow with name ${workflow.name} in Global list`);
                Workflows.push(workflow);
                newWorkflowsAddedCount++;
            }
            else
            {
                console.log(`Workflow with name ${workflow.name} already exists in Global list`);
            }
        });

        if (newWorkflowsAddedCount > 0)
        {
            SyncWorkflows();
            SaveWorkflowsToStorage();
            ShowStatusMessage(`${newWorkflowsAddedCount} workflow(s) loaded.`)
        }
    }).catch(error => {
        console.error(error);
    });

});

function LoadWorkflowsFromFile() {
    return new Promise((resolve, reject) => {
        // Create an input element to trigger the file picker dialog
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json'; // Accept only .json files

        // Add an event listener to handle file selection
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                // When file is loaded, process the content
                reader.onload = function(event) {
                    try {
                        const jsonData = JSON.parse(event.target.result);

                        // Validate and convert the JSON data to Workflow objects
                        const workflows = jsonData.map(w => new Workflow(w.name, w.urls));

                        // Resolve the promise with the array of Workflow objects
                        resolve(workflows);
                    } catch (error) {
                        console.error('Unable to parse the JSON file');
                        reject('Unable to parse the JSON file');
                    }
                };

                // Read the file as a text
                reader.readAsText(file);
            } else {
                reject('No file selected');
            }
        });

        // Trigger the file picker dialog
        input.click();
    });
}

function SaveWorkflowsToStorage() {
    try {
        // Convert Workflows array to JSON string and store it in localStorage
        localStorage.setItem('workflows', JSON.stringify(Workflows));
        console.log('Workflows saved successfully.');
    } catch (error) {
        console.error('Error saving workflows to storage:', error);
    }
}
  

function LoadWorkflowsFromStorage() {
    try {
        // Retrieve the JSON string from localStorage
        const workflowsData = localStorage.getItem('workflows');
        if (workflowsData) {
        // Parse the JSON string back into an array of Workflow objects
        const parsedWorkflows = JSON.parse(workflowsData);

        // Recreate the Workflow objects and assign to the Workflows array
        Workflows = parsedWorkflows.map(wf => {
            let workflow = new Workflow(wf.name, wf.urls);
            workflow.editFlag = wf.editFlag; // Copy additional properties if needed
            return workflow;
        });
        console.log('Workflows loaded successfully.');
        } else {
        console.log('No workflows found in storage.');
        }
    } catch (error) {
        console.error('Error loading workflows from storage:', error);
    }

    const introText = document.getElementById('IntroText');
    if (Workflows.length > 0)
        introText.style.display = "none";
    else
        introText.style.display = "block";

    SyncWorkflows();
}

function PopulateEditScreen(workflow=null){
    var isedit = workflow != null;
    workflowTitle = document.getElementById("WorkflowTitle");
    const urlList = document.querySelector('.url-list');

    if (isedit)
    {
        workflow.editFlag = true;
        workflowTitle.value = workflow.name;
        urlList.innerHTML = ''; // Clears all the child elements inside the .url-list
        workflow.urls.forEach(url => {
            const newUrlItem = document.createElement('div');
            newUrlItem.classList.add('list-item');
    
            // Create the input and buttons for the new URL item
            const input = document.createElement('input');
            input.type = 'text';
            input.value = url
            input.placeholder = 'Add URL';
            input.classList.add('url-input');
            input.style.width = '250px';
    
            const plusButton = document.createElement('button');
            plusButton.classList.add('field-icon');
            plusButton.style.width = '50px';
            plusButton.innerHTML = '➕';
            plusButton.title = "Add URL below";
            plusButton.addEventListener('click', AddUrlClicked);
    
            const crossButton = document.createElement('button');
            crossButton.classList.add('field-icon');
            crossButton.style.width = '50px';
            crossButton.innerHTML = '❌';
            crossButton.title = "Delete URL";
            crossButton.addEventListener('click', DeleteUrlClicked);
    
            // Append the input and buttons to the new URL item
            newUrlItem.appendChild(input);
            newUrlItem.appendChild(plusButton);
            newUrlItem.appendChild(crossButton);
    
            // Insert the new URL item after the clicked button's parent
            urlList.appendChild(newUrlItem);
        })
    }
    else
    {
        workflowTitle.value = '';
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
        plusButton.title = "Add URL below";
        plusButton.addEventListener('click', AddUrlClicked);

        const crossButton = document.createElement('button');
        crossButton.classList.add('field-icon');
        crossButton.style.width = '50px';
        crossButton.innerHTML = '❌';
        crossButton.title = "Delete URL";
        crossButton.addEventListener('click', DeleteUrlClicked);

        // Append the input and buttons to the new URL item
        newUrlItem.appendChild(input);
        newUrlItem.appendChild(plusButton);
        newUrlItem.appendChild(crossButton);

        // Insert the new URL item after the clicked button's parent
        urlList.appendChild(newUrlItem);

        const elementToFocus = document.getElementById("WorkflowTitle");
        elementToFocus.focus();
    }
}

function isValidUrl(string) {
    const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return regex.test(string);
}
  
function SyncWorkflows()
{
    const workflowList = document.querySelector('.workflow-list');
    workflowList.innerHTML = ''; // Clears all the child elements inside the .url-list
    const introText = document.getElementById('IntroText');
    if (Workflows.length > 0)
        introText.style.display = "none";
    else
        introText.style.display = "block";

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
        editButton.title = "Edit Workflow";
        editButton.style = 'width: 30px';``
        editButton.textContent = '✏️'; // Edit icon
        editButton.addEventListener('click', EditWorkflowClicked); // Edit icon
    
        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'field-icon';
        deleteButton.id = 'DeleteWorkflowButton';
        deleteButton.title = "Delete Workflow"
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
    const parentDiv = event.target.parentNode;
    const firstButton = parentDiv.querySelector('button:first-child');
    var target = null;
    for (var i = 0; i < Workflows.length; i++)
    {
        if (Workflows[i].name == firstButton.textContent)
        {
            target = Workflows[i];
            break;
        }
    }

    var urls = "";
    if (target != null)
    {
        // Loop through the array and open each URL in a new tab
        target.urls.forEach(url => {
            var tempUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                tempUrl = 'https://' + url; // Prepend 'https://' if missing
              }
            window.open(tempUrl, "_blank"); // _blank ensures it opens in a new tab
        });
    }
}

function EditWorkflowClicked(event)
{
    const parentDiv = event.target.parentNode;
    const firstButton = parentDiv.querySelector('button:first-child');
    const workflowName = firstButton.textContent;

    for (var i = 0; i < Workflows.length; i++)
    {
        console.log(`i: ${i}, workflowname: xx${workflowName}xx, iname: xx${Workflows[i].name}xx`);
        if (Workflows[i].name === workflowName)
        {
            document.getElementById("MainScreen").style.display = "none";
            document.getElementById("EditScreen").style.display = "block";
            PopulateEditScreen(Workflows[i]);
            return;
        }
    }
}

function LoadOpenedTabs(workflow)
{
    console.log(`Import: workflowname: xx${workflow.name}xx, workflowLength: xx${workflow.urls.length}xx`);
    document.getElementById("MainScreen").style.display = "none";
    document.getElementById("EditScreen").style.display = "block";
    PopulateEditScreen(workflow);
    return;
}

function DeleteWorkflowClicked(event)
{
    const button = event.target;
    if (button.classList.contains('field-icon') && button.textContent === '❌') {
          button.parentNode.remove();
    }

    const parentDiv = event.target.parentNode;
    const firstButton = parentDiv.querySelector('button:first-child');
    Workflows = Workflows.filter(workflow => workflow.name !== firstButton.textContent);

    SaveWorkflowsToStorage();
    const introText = document.getElementById('IntroText');
    if (Workflows.length > 0)
        introText.style.display = "none";
    else
        introText.style.display = "block";

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
    plusButton.title = "Add URL below";
    plusButton.addEventListener('click', AddUrlClicked);

    const crossButton = document.createElement('button');
    crossButton.classList.add('field-icon');
    crossButton.style.width = '50px';
    crossButton.innerHTML = '❌';
    crossButton.title = "Delete URL";
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

function ShowStatusMessage(message) {
    const statusBar = document.getElementById('StatusBar');
    statusBar.textContent = message;
    statusBar.style.display = 'inline';
    // Set a timeout to hide the label after 3 seconds (3000 milliseconds)
    setTimeout(() => {
        statusBar.style.display = 'none'; // Hides the label
    }, 2000);
}

LoadWorkflowsFromStorage();