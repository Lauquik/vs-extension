import * as vscode from "vscode";


export class ChatGPTViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "nava-assist-view";
  
    private _view?: vscode.WebviewView;
  
    // In the constructor, we store the URI of the extension
    constructor(private readonly _extensionUri: vscode.Uri) {}
  
    public resolveWebviewView(
      webviewView: vscode.WebviewView,
    ) {
      this._view = webviewView;
  
      // set options for the webview
      webviewView.webview.options = {
        // Allow scripts in the webview
        enableScripts: true,
        localResourceRoots: [this._extensionUri],
      };
  
      // set the HTML for the webview
      webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
      // add an event listener for messages received by the webview
      webviewView.webview.onDidReceiveMessage((data) => {
        switch (data.type) {
          case "prompt": {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
              return vscode.window.showInformationMessage("No active editor");
            }
            const document = activeEditor.document;
            const fileName = document.fileName;
            const fileExtension = fileName.split(".").pop();
  
            // Get the entire content of the file
            const entireContent = document.getText();
  
            // Get the content selected by the user
            const selection = activeEditor.selection;
            const selectedContent = document.getText(selection);
  
            console.log(`File: ${fileName}, Extension: ${fileExtension}`);
            console.log(`Entire Content: ${entireContent}`);
            console.log(`Selected Content: ${selectedContent}`);
            console.log(`User Written Cotent: ${data.value}`);
  
            webviewView.webview.postMessage({
              type: "displayMessage",
              text: "Your message has been received: " + data.value
            });
            break;
          }
        }
      });
    }
  
    private _getHtmlForWebview(webview: vscode.Webview) {
      const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(this._extensionUri, "assets", "scripts", "main.js")
      );
      return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Chat</title>
              <style>
                  #chat-container {
                      display: flex;
                      flex-direction: column;
                      height: 100vh;
                  }
  
                  #response {
                      flex-grow: 1;
                      overflow-y: auto;
                      padding: 10px;
                      border-bottom: 1px solid #ccc;
                  }
  
                  #prompt-container {
                      display: flex;
                      padding: 10px;
                      border-top: 1px solid #ccc;
                  }
  
                  #input-wrapper {
                      position: relative;
                      display: flex;
                      flex-grow: 1;
                  }
                  
                  #prompt-input {
                      color: white;
                      flex-grow: 1;
                      margin-right: 10px;
                      background-color: #2F4F4F;
                      padding-right: 30px;
                      padding: 10px;
                      border-radius: 4px;
                      border: 1px solid #ccc;
                  }
                  
                  #send-button:hover {
                      background-color: #2F4F4F;
                  }
                  
                  #send-button i {
                      pointer-events: none;
                  }
              </style>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
              <body>
                  <div id="chat-container">
                      <div id="response"></div>
                      <div id="prompt-container">
                          <div id="input-wrapper">
                              <input id="prompt-input" type="text">
                              <button id="send-button"><i class="fa fa-send-o" style="font-size:24px"></i></button>
                          </div>
                      </div>
                  </div>
                  <script src="${scriptUri}"></script>
              </body>
          </html>`;
    }
  }
  