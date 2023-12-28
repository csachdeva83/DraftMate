import { DraftHandleValue, Editor, EditorState, Modifier, RichUtils, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { OrderedSet } from 'immutable';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [sequence, setSequence] = useState<string>('');
    const editorRef = useRef<Editor>(null);

    useEffect(() => {
        if (editorRef.current) editorRef.current.focus();
    }, []);

    const styleMap = {
        RED: {
            color: 'red',
        },
    };

    const handleKeyCommand = useCallback(
        (command: string): DraftHandleValue => {
            if (command === 'myeditor-heading1') {
                const newEditorState = RichUtils.toggleBlockType(editorState, 'header-one');
                setEditorState(newEditorState);
                return 'handled';
            } else if (command === 'myeditor-bold') {
                const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
                setEditorState(newEditorState);
                return 'handled';
            } else if (command === 'myeditor-colorRed') {
                // const currentContent = editorState.getCurrentContent();
                // const currentSelection = editorState.getSelection();

                // const rawText = currentContent.getPlainText();
                // console.log('Text from editor:', rawText);

                // const set1 = OrderedSet<string>(['RED']);

                // // Insert characters '😃123' with the change type 'insert-characters'
                // const newContent = Modifier.replaceText(currentContent, currentSelection, '😃123', set1);
                // const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');

                // setEditorState(newEditorState);
                // const selection1 = editorState.getSelection();
                // const contentState1 = editorState.getCurrentContent();
                // const blockStartKey = selection1.getStartKey();
                // const block = contentState1.getBlockMap().get(blockStartKey);

                // console.log(block);

                // const newEditorState = RichUtils.toggleBlockType(editorState, 'start-unordered-list');
                // const contentState2 = newEditorState.getCurrentContent();
                // const selection2 = newEditorState.getSelection();
                // const blockSelection = selection2.merge({
                //     anchorOffset: 2,
                //     focusOffset: block.getLength(),
                // });

                // const newContentState = Modifier.replaceText(contentState2, blockSelection, '');
                // setEditorState(EditorState.push(newEditorState, newContentState, 'insert-characters'));

                const currentSelection = editorState.getSelection();
                const contentState = editorState.getCurrentContent();
                // const currentContent = contentState.getPlainText(); // Get the plain text content

                // Get the start and end offsets for the range to replace
                const endOffset = currentSelection.getStartOffset();
                const startOffset = endOffset - 2; // Two characters back from the cursor

                if (startOffset >= 0) {
                    // Ensure the start offset is valid
                    // const newTextContent =
                    //     currentContent.substring(0, startOffset) + currentContent.substring(endOffset);

                    const set1 = OrderedSet<string>(['RED']);

                    // Replace the substring with an empty string
                    const newContentState = Modifier.replaceText(
                        contentState,
                        currentSelection.merge({
                            anchorOffset: startOffset,
                            focusOffset: endOffset,
                        }),
                        ' ',
                        set1,
                    );

                    // Create a new EditorState with the updated content
                    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');

                    // Set the new EditorState
                    // Replace 'setEditorState' with the function you use to update the editor state
                    setEditorState(newEditorState);
                }

                return 'handled';
            } else if (command === 'myeditor-underline') {
                const newEditorState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
                setEditorState(newEditorState);
                return 'handled';
            }

            const newState = RichUtils.handleKeyCommand(editorState, command);

            if (newState) {
                setEditorState(newState);
                return 'handled';
            }

            return 'not-handled';
        },
        [editorState],
    );

    const myKeyBindingFn = (event: KeyboardEvent<HTMLInputElement>): string | null => {
        if (event.key === '#' && sequence === '') {
            setSequence('#');
        } else if (event.key === ' ' && sequence === '#') {
            setSequence('');
            return 'myeditor-heading1';
        } else if (event.key === '*' && sequence === '') {
            setSequence('*');
        } else if (event.key === ' ' && sequence === '*') {
            setSequence('');
            return 'myeditor-bold';
        } else if (event.key === '*' && sequence === '*') {
            setSequence('**');
        } else if (event.key === '*' && sequence === '**') {
            setSequence('***');
        } else if (event.key === ' ' && sequence === '***') {
            setSequence('');
            return 'myeditor-underline';
        } else if (event.key === ' ' && sequence === '**') {
            setSequence('');
            return 'myeditor-colorRed';
        } else {
            setSequence('');
        }

        // If it is not custom then add default key binding
        return getDefaultKeyBinding(event);
    };

    return (
        <div className="playground-wrapper">
            <div className="navbar-container">
                <h3>
                    Demo editor by <span>Cherish Sachdeva</span>
                </h3>
                <button>Save</button>
            </div>
            <div className="editor-container">
                <Editor
                    customStyleMap={styleMap}
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={myKeyBindingFn}
                    ref={editorRef}
                />
            </div>
        </div>
    );
};

export default App;
