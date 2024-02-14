import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import * as esbuild from "esbuild-wasm"

(async () => {
    await esbuild.initialize({
        worker: false,
        wasmURL: "/esbuild.wasm"
    });
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
