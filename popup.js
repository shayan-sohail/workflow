document.getElementById("create-workflow").addEventListener("click", function() {
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("create-workflow-screen").style.display = "block";
    const elementToFocus = document.getElementById("WorkflowTitle");
    elementToFocus.focus();
});

document.getElementById("save-workflow").addEventListener("click", function() {
    document.getElementById("create-workflow-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
});

// Get the URL list container
const urlList = document.querySelector('.url-list');

// Add event listeners to the + and x buttons
urlList.addEventListener('click', (event) => {
  const button = event.target;

  // If the clicked button is the + button
  if (button.classList.contains('field-icon') && button.textContent === '+') {
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
    plusButton.innerHTML = '+';

    const crossButton = document.createElement('button');
    crossButton.classList.add('field-icon');
    crossButton.style.width = '50px';
    crossButton.innerHTML = '×';

    // Append the input and buttons to the new URL item
    newUrlItem.appendChild(input);
    newUrlItem.appendChild(plusButton);
    newUrlItem.appendChild(crossButton);

    // Insert the new URL item after the clicked button's parent
    button.parentNode.after(newUrlItem);
  }

  // If the clicked button is the x button
  if (button.classList.contains('field-icon') && button.textContent === '×') {
    // Check if there's only one URL item left
    const urlItems = document.querySelectorAll('.url-item');
    if (urlItems.length > 1) {
      button.parentNode.remove();
    }
  }
});