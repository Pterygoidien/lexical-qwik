import {
  createContextId,
  //   $,
  //   useContext,
  //   useContextProvider,
} from "@builder.io/qwik";
import { EditorThemeClasses, LexicalEditor } from "lexical";

type LexicalComposerContextType = {
  getTheme: () => EditorThemeClasses | null | undefined;
};

type LexicalComposerContextWithEditor = [
  LexicalEditor,
  LexicalComposerContextType,
];

const LexicalComposerContext =
  createContextId<LexicalComposerContextWithEditor>("lexical.context");

const createLexicalComposerContext = (
  parent: LexicalComposerContextWithEditor | null | undefined,
  theme: EditorThemeClasses | null | undefined
): LexicalComposerContextType => {
  let parentContext: LexicalComposerContextType | null = null;

  if (parent != null) {
    parentContext = parent[1];
  }
  function getTheme() {
    if (theme != null) {
      return theme;
    }
    return parentContext != null ? parentContext.getTheme() : null;
  }
  return { getTheme };
};

// const useLexicalComposerContext = $(() => {
//   useContextProvider(LexicalComposerContext, null);
//   const composerContext = useContext(LexicalComposerContext);
//   if (!composerContext) {
//     throw new Error(
//       "useLexicalComposerCOntext: cannot find a LexicalComposerContext"
//     );
//   }
//   return composerContext;
// });

export type {
  LexicalComposerContextType,
  LexicalComposerContextWithEditor,
  //   useLexicalComposerContext,
};
export { createLexicalComposerContext, LexicalComposerContext };
