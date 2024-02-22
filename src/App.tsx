import * as esbuild from "esbuild-wasm";
import { useRef, useState } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugins";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  async function onClick() {
    // esbuild transpiling
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    setResult(result.outputFiles[0].text);
  }

  return (
    <>
      <div>
        <CodeEditor
          initialValue={"const a = 1"}
          onChange={(value) => setInput(value)}
        />
        <div>
          <button onClick={onClick}>Submit</button>
        </div>
        <Preview code={result} />
      </div>
    </>
  );
}

export default App;
