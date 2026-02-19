import * as vscode from "vscode";

export const componentContent = (name: string) => `import React from "react";
import { ${name}Wrapper } from "./${name}.styles";

export interface I${name}Props {
  className?: string;
}
export const ${name} = ({ className }: I${name}Props) => {
  return <${name}Wrapper className={className}>${name}</${name}Wrapper>;
};`;

export const stylesContent = (
  name: string,
) => `import styled from "@emotion/styled";

export const ${name}Wrapper = styled.div\`\``;

export const writeFile = (filePath: string, content: string) => {
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(filePath),
    Buffer.from(content, "utf8"),
  );
};
