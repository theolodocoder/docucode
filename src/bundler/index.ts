import * as esbuild from "esbuild-wasm";
import "bulmaswatch/cyborg/bulmaswatch.min.css";
import { fetchPlugin } from "../plugins/fetch-plugin";
import { unpkgPathPlugin } from "../plugins/unpkg-path-plugins";

let initialized = false;
export default async (rawCode: string) => {
  // Initialize esbuild (if not already initialized)
  if (!initialized) {
    await esbuild.initialize({
      worker: false,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.20.0/esbuild.wasm",
    });

    initialized = true;
  }
  // actual code bundling
  const result = await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      "process.env.NODE_ENV": '"production"',
      global: "window",
    },
  });

  return result.outputFiles[0].text;
};
