/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filesdb",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      build.onResolve({filter:/^\.+\//},(args:any) => {
        return {
          path: new URL(
            args.path,
            "https://unpkg.com" + args.resolveDir + "/"
          ).href,
          namespace: "a",
        };

      })

      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

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
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store the result in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
