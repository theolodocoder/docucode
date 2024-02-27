import { useState } from "react";
import bundler from "./bundler";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  async function onClick() {
    // esbuild transpiling
    const result = await bundler(input);
    setResult(result);
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
