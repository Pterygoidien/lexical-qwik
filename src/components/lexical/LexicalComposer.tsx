import { JSXOutput, NoSerialize, Slot, component$, noSerialize, useContextProvider, useStore, useTask$ } from "@builder.io/qwik";
import { EditorState, EditorThemeClasses, HTMLConfig, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement, createEditor, $getRoot, $createParagraphNode, $getSelection } from "lexical";
import { LexicalComposerContext, LexicalComposerContextType, LexicalComposerContextWithEditor, createLexicalComposerContext } from "./LexicalComposerContext";

const HISTORY_MERGE_OPTIONS = {tag:"history-merge"};

export type InitialEditorStateType =
    | null
    | string
    | EditorState
    | ((editor: LexicalEditor) => void);


export type InitialConfigType = Readonly<{
    // editor__DEPRECATED?: LexicalEditor | null
    namespace: string;
    nodes?: NoSerialize<(ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>)>;
    onError: NoSerialize<(error: Error, editor: LexicalEditor) => void>;
    editable?: boolean;
    theme?: EditorThemeClasses;
    editorState?: NoSerialize<InitialEditorStateType>;
    html?: HTMLConfig;
}>;


type Props = {
    initialConfig: InitialConfigType;
}

export const LexicalComposer = component$<Props>(({ initialConfig }): JSXOutput => {

    const {
        namespace, 
        nodes, 
        onError,
        editorState : initialEditorState,
        html,
        theme,
        editable,
    } = initialConfig;

    const editorStore = useStore<{editor: NoSerialize<LexicalEditor>}>({editor: undefined});
    

    const context = createLexicalComposerContext(null, theme);

    

    useTask$(({track}) => {
        track(() => editable); 
        const isEditable = editable === undefined ? true : editable;
        // const [editor] = useContext(LexicalComposerContext).editor; 
        const editor = createEditor({
            editable: editable, 
            html: html, 
            namespace: namespace,
            nodes: nodes, 
            onError: (error) => onError && onError(error, editor),
            theme: theme,
        })
        editor.setEditable(isEditable)
        initializeEditor(editor, initialEditorState);

        editorStore.editor = noSerialize(editor);
    });
    useContextProvider<LexicalComposerContextWithEditor>(LexicalComposerContext, [editorStore.editor, context] as [LexicalEditor, LexicalComposerContextType]);

    return (<>
        <Slot />
    </>)
});

function initializeEditor(
    editor: LexicalEditor,
    initialEditorState?: InitialEditorStateType
): void {
    if (initialEditorState === null) {
        return;
    }
    else if (initialEditorState === undefined) {
        editor.update(() => {
            const root = $getRoot();
            if (root.isEmpty()) {
                const paragraph = $createParagraphNode();
                root.append(paragraph);

                const activeElement = typeof window !== "undefined" ? window.document.activeElement : null;
                if (
                    $getSelection() !== null || (activeElement !== null && activeElement === editor.getRootElement())
                ) {
                    paragraph.select()
                }
            }
        }, HISTORY_MERGE_OPTIONS);
    } else if (initialEditorState !== null) {
        switch (typeof initialEditorState) {
            case "string": {
                const parsedEditorState = editor.parseEditorState(initialEditorState);
                editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
                break;
            }
            case "object": {
                editor.setEditorState(initialEditorState, HISTORY_MERGE_OPTIONS);
                break;
            }
            case "function": {
                editor.update(() => {
                    const root = $getRoot();
                    if (root.isEmpty()) {
                        initialEditorState(editor);
                    }
                }, HISTORY_MERGE_OPTIONS);
                break;
            }
        }
    }
 }