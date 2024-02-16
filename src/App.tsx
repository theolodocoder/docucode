import * as esbuild from "esbuild-wasm";
import { useRef, useState } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugins";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const iframe = useRef<any>(null)

  async function onClick() {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(),fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text,'*')
  }

  const html = `
  <html>
  <head>
    <script>
        window.addEventListener("message",(event) => {
          eval(event.data)
        },false)
    </script>
  </head>
  <body>
  <div id="root"></div>
  </body>
  </html>
  `

  return (
    <>
      <div>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
        ></textarea>
        <div>
          <button onClick={onClick}>Submit</button>
        </div>
        <pre>{code}</pre>
        <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts"></iframe>
      </div>
    </>
  );
}


export default App;
