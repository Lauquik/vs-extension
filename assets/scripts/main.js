// @ts-ignore 

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();  
  window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    switch (message.type) {
      case 'displayMessage':
        let paragraph = document.createElement('p');
        paragraph.textContent = message.text;
        responseElement.appendChild(paragraph);
        break;
    }
  });
  // Listen for keyup events on the prompt input element
  let inputElement = document.getElementById('prompt-input');
  let buttonElement = document.getElementById('send-button');
  let responseElement = document.getElementById('response');

  function postMessage() {
    vscode.postMessage({
      type: 'prompt',
      value: inputElement.value
    });
  
    // Add the input value to the response div
    let paragraph = document.createElement('p');
    paragraph.textContent = inputElement.value;
    responseElement.appendChild(paragraph);
  
    // Clear the input
    inputElement.value = '';
  }
  
  inputElement.addEventListener('keyup', function (e) {
    // If the key that was pressed was the Enter key
    if (e.key === "Enter") { 
      postMessage();
    }
  });
  
  buttonElement.addEventListener('click', postMessage);

})();

