import { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as prettier from "prettier";
import parser from "prettier/parser-babel";
import "./CodeEditor.css";
// import codeShift from "jscodeshift"

interface CodeEditorProps {
  initialValue: string;
  onChange: (input: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleOnMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    // on mount set the editorRef
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });

    // :::::::::::::::::::::::::::::::::::::::::NOTE WILL VISIT HIGHLIGHTING AGAIN :::::::::::::::::::::::::::::::::::::::::
    // const { default: traverse } = await import("@babel/traverse");
    // const { parse } = await import("@babel/parser");
    // const {
    //   default: MonacoJSXHighlighter,
    //   JSXTypes,
    //   makeBabelParse, //By @HaimCandiTech
    // } = await import(
    //   "monaco-jsx-highlighter" // Note: there is a polyfilled version alongside the regular version.
    // );

    // const parseJSX = makeBabelParse(parse, true);

    // const monacoJSXHighlighter = new MonacoJSXHighlighter(
    //   monaco,
    //   parseJSX,
    //   traverse,
    //   editor
    // );

    // // Activate highlighting (debounceTime default: 100ms)
    // monacoJSXHighlighter.highlightOnDidChangeModelContent(100);
  };

  const handleFormat = async () => {
    // get the current value from the editor
    const unformattedCode = editorRef.current.getModel().getValue();

    // format the code using prettier
    const formattedCode = prettier
      .format(unformattedCode, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    // set the editors code back to the formatted code
    editorRef.current.setValue(formattedCode);
  };

  return (
    <>
      <div className="editor-wrapper">
        <button
          onClick={handleFormat}
          className="button is-primary is-small button-format"
        >
          Format
        </button>
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
