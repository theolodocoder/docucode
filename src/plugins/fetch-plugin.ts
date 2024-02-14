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
    build.onLoad({filter:/(^index\.js$)/},() => {
      return {
        loader: "jsx",
        contents: inputCode,
      };
    })
    build.onLoad({ filter: /.*/ }, async (args:any) => {
        // check if the file to load already exist in our cache
        // const cachedFile = await fileCache.getItem<esbuild.OnLoadResult>(
        //   args.path
        // );
        // // if so return it
        // if (cachedFile) {
        //   return cachedFile;
        // }
        // if we dont have it the we can make the request
        const fileType = args.path.match(/.css$/) ? 'css':'jsx'
        const { data, request } = await axios.get(args.path);
        const escaped = data.replace(/\n/g,''.replace(/"/g, '\\"')).replace(/'/g,"\\'");
        const contents = fileType == 'css'? `
          const style = document.createElement("style")
          style.innerText = '${escaped}'
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