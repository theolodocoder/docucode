import { Editor } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import React from "react"

interface CodeEditorProps{
  initialValue :string
  onChange:(input:string) => void
}
const CodeEditor:React.FC<CodeEditorProps> = ({initialValue,onChange}) => {
  const handleOnMount = (editor:editor.IStandaloneCodeEditor,_) => {
    editor.onDidChangeModelContent(()=> {
      onChange(editor.getValue())
    })
  }
  return <Editor height={"90vh"} language="javascript" theme="vs-dark" value={initialValue} onMount={handleOnMount} options={{
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