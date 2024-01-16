// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, window } from "vscode";
import { createAgentInstance, disposeAgentInstance } from "./agent";
import { tabbyCommands } from "./commands";
import { TabbyCompletionProvider } from "./TabbyCompletionProvider";
import { TabbyStatusBarItem } from "./TabbyStatusBarItem";
import { ChatGPTViewProvider } from "./ChatViewProvider";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  console.debug("Activating Tabby extension", new Date());
  await createAgentInstance(context);
  const completionProvider = new TabbyCompletionProvider();
  const statusBarItem = new TabbyStatusBarItem(context, completionProvider);
  const provider = new ChatGPTViewProvider(context.extensionUri);
  context.subscriptions.push(
    languages.registerInlineCompletionItemProvider({ pattern: "**" }, completionProvider),
    statusBarItem.register(),
    ...tabbyCommands(context, completionProvider, statusBarItem),
    window.registerWebviewViewProvider(
      ChatGPTViewProvider.viewType,
      provider,
      {
        webviewOptions: { retainContextWhenHidden: true },
      }
    ),
  );
}

// this method is called when your extension is deactivated
export async function deactivate() {
  console.debug("Deactivating Tabby extension", new Date());
  await disposeAgentInstance();
}
