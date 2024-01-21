import { Counter } from "./components/counter/counter";
import { LexicalComposer } from "./components/lexical/LexicalComposer";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <LexicalComposer>
          hello
        </LexicalComposer>
      </body>
    </>
  );
};
