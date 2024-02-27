import { useEffect, useRef } from "react";
import "./preview.css";

interface PreviewProps {
  code: string;
}

const html = `
  <html>
  <head>
    <script>
        window.addEventListener("message",(event) => {
          try{
          eval(event.data)
          }catch(err){
            document.querySelector("#root").innerHTML = '<div style="color:red"><h4>Runtime error</h4>' + err + '</div>'
            console.error(err)
          }
        },false)
    </script>
  </head>
  <body>
  <div id="root"></div>
  </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iframe = useRef<any>(null);

  useEffect(() => {
    iframe.current.srcdoc = html;
    // communicate with underlying iframe and send a message
    iframe.current.contentWindow.postMessage(code, "*");
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        className="preview"
        title="preview"
        ref={iframe}
        srcDoc={html}
        // this enables us to conmmunicate with the iframe from the parent
        sandbox="allow-scripts"
      ></iframe>
    </div>
  );
};

export default Preview;
