import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as prettier from "prettier";
import parser from "prettier/parser-babel";
import "./CodeEditor.css"

interface CodeEditorProps {
  initialValue: string;
  onChange: (input: string) => void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleOnMount = (editor: editor.IStandaloneCodeEditor, _) => {
    // on mount set the editorRef
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const handleFormat = async () => {
    // get the current value from the editor
    const unformattedCode = editorRef.current.getModel().getValue();

    // format the code using prettier
    const formattedCode =prettier.format(unformattedCode, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/,"");

    // set the editors code back to the formatted code
    editorRef.current.setValue(formattedCode)
  };

  return (
    <>
    <div className="editor-wrapper">
      <button onClick={handleFormat} className="button is-primary is-small button-format">Format</button>
      <Editor
        height={"90vh"}
        language="javascript"
        theme="vs-dark"
        value={initialValue}
        onMount={handleOnMount}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          fontLigatures: true,
          fontSize: 16,
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 3,
          automaticLayout: true,
        }}
      />
    </div>
    </>
  );
};

export default CodeEditor;
