import { Editor } from "@monaco-editor/react"
import React from "react"

const CodeEditor = () => {
  return <Editor height={"90vh"} language="javascript" theme="vs-dark" options={{
    wordWrap:"on",
    minimap:{enabled:false},
    showUnused:false,
    folding:false,
    fontLigatures:true,
    fontSize:16,
    scrollBeyondLastLine:false,
    lineNumbersMinChars:3,
    automaticLayout:true
  }} />
}

export default CodeEditor