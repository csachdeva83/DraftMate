import { DraftHandleValue, Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
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
            } else if (command === 'myeditor-underline') {
                const newEditorState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
                setEditorState(newEditorState);
                return 'handled';
            } else if (command === 'myeditor-colorRed') {
                const newEditorState = RichUtils.toggleInlineStyle(editorState, 'RED');
                setEditorState(newEditorState);
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
