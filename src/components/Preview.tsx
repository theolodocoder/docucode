import { useEffect, useRef } from "react";

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
    <iframe
      title="preview"
      ref={iframe}
      srcDoc={html}
      sandbox="allow-scripts"
    ></iframe>
  );
};

export default Preview;
