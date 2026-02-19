import * as vscode from "vscode";
import * as path from "path";
import { componentContent, stylesContent, writeFile } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.newComponent",
    async (uri: vscode.Uri) => {
      const items = await vscode.workspace.fs.readDirectory(uri);

      // get the component name
      let name: string | undefined = "";
      let prompt = "Enter name";
      do {
        name = await vscode.window.showInputBox({
          prompt,
          value: name,
        });
        if (!name) {
          return;
        }
        // already exists
        var isCoincidence = items.some(
          (item) => item[0] === name && item[1] === 2,
        );
        if (isCoincidence) {
          prompt = "Choose another";
        }
      } while (isCoincidence);

      // define paths
      const basePath = uri.fsPath; // uri.fsPath - right-clicked folder
      const componentDirPath = path.join(basePath, name);
      const uiDirPath = path.join(componentDirPath, "ui");
      const indexPath = path.join(componentDirPath, "index.ts");

      try {
        // create directories
        await vscode.workspace.fs.createDirectory(
          vscode.Uri.file(componentDirPath),
        );
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(uiDirPath));

        // create index.ts
        const indexContent = `export * from './ui/${name}';`;
        await writeFile(indexPath, indexContent);

        // create {Name}.tsx
        await writeFile(
          path.join(uiDirPath, `${name}.tsx`),
          componentContent(name),
        );

        await writeFile(
          path.join(uiDirPath, `${name}.styles.ts`),
          stylesContent(name),
        );

        // notification
        vscode.window.showInformationMessage(`Component "${name}" created!`);
      } catch (error) {
        vscode.window.showErrorMessage(`Error creating component: ${error}`);
      }
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
