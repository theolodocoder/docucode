import * as esbuild from "esbuild-wasm"
import localForage from "localforage";
import axios from "axios";

const fileCache = localForage.createInstance({
  name: "filesdb",
});


export const fetchPlugin = (inputCode:string) => {
  return{
    name: "fetch-plugin",
    setup(build:esbuild.PluginBuild){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.onLoad({ filter: /.*/ }, async (args:any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }
        // check if the file to load already exist in our cache
        const cachedFile = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if so return it
        if (cachedFile) {
          return cachedFile;
        }
        // if we dont have it the we can make the request
        const { data, request } = await axios.get(args.path);
        const contents = args.path.match(/.css$/) ? `
          const style = document.createElement("style")
          style.innerText = 'body:{background:red}'
          document.head.appendChild(style)
        `:data
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store the result in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    }
  }
}