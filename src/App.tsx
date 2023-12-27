import { DraftHandleValue, Editor, EditorState, Modifier, RichUtils, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [sequence, setSequence] = useState<string>('');
    const editorRef = useRef<Editor>(null);

    useEffect(() => {
        if (editorRef.current) editorRef.current.focus();
    }, []);

    const handleKeyCommand = useCallback(
        (command: string): DraftHandleValue => {
            if (command === 'myeditor-heading6') {
                const contentState = editorState.getCurrentContent();
                const selectionState = editorState.getSelection();

                const newContentState = Modifier.setBlockType(
                    contentState,
                    selectionState,
                    'header-six', // Change this to the desired block type (e.g., 'header-one' for a heading)
                );

                const newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');
                setEditorState(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
                return 'handled';
            }

            if (command === 'myeditor-heading1') {
                const contentState = editorState.getCurrentContent();
                const selectionState = editorState.getSelection();

                const newContentState = Modifier.setBlockType(
                    contentState,
                    selectionState,
                    'header-one', // Change this to the desired block type (e.g., 'header-one' for a heading)
                );

                const newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');
                setEditorState(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
                return 'handled';
            }

            const newState = RichUtils.handleKeyCommand(editorState, command);

            // newState is one of the commands mapped to DOM shortcuts
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
            // Store the '#' in the sequence state when it's the first character
            setSequence('#');
        } else if (event.key === ' ' && sequence === '#') {
            // If space follows the '#', indicating the desired sequence
            setSequence(''); // Reset the sequence
            return 'myeditor-heading1';
            // Perform actions for the sequence being detected
        } else if (event.key === '*' && sequence === '') {
            // Store the '#' in the sequence state when it's the first character
            setSequence('*');
        } else if (event.key === ' ' && sequence === '*') {
            // If space follows the '#', indicating the desired sequence
            setSequence(''); // Reset the sequence
            return 'myeditor-heading6';
            // Perform actions for the sequence being detected
        } else {
            // Reset the sequence if an unexpected key is pressed in between
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
