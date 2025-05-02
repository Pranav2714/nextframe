/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { DEPENDANCIES } from "@/constants/dependencies";
import { dracula } from "@codesandbox/sandpack-themes";

const CodeEditor = ({ codeResp, isReady }: any) => {
  return (
    <div>
      {isReady ? (
        <Sandpack
          template="react"
          theme={dracula}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 600,
          }}
          customSetup={{
            dependencies: {
              ...DEPENDANCIES,
            },
          }}
          files={{
            "/App.js": `${codeResp}`,
          }}
        />
      ) : (
        <SandpackProvider
          template="react"
          theme={dracula}
          files={{
            "/app.js": {
              code: `${codeResp}`,
              active: true,
            },
          }}
          customSetup={{
            dependencies: {
              ...DEPENDANCIES,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor showTabs={true} style={{ height: "70vh" }} />
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
};

export default CodeEditor;
