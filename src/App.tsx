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
        HEADING: {
            fontSize: '2em',
            fontWeight: 'bold',
            lineHeight: '1.2',
        },
        BOLD: {
            fontWeight: 'bold',
        },
        UNDERLINE: {
            textDecoration: 'underline',
        },
    };

    const handleKeyCommand = useCallback(
        (command: string): DraftHandleValue => {
            let removeCharacterLength = 0;
            let set;
            let isCustomCommand = false;

            if (command === 'myeditor-heading1') {
                removeCharacterLength = 1;
                set = OrderedSet<string>(['HEADING']);
                isCustomCommand = true;
            } else if (command === 'myeditor-bold') {
                removeCharacterLength = 2;
                set = OrderedSet<string>(['BOLD']);
                isCustomCommand = true;
            } else if (command === 'myeditor-colorRed') {
                removeCharacterLength = 2;
                set = OrderedSet<string>(['RED']);
                isCustomCommand = true;
            } else if (command === 'myeditor-underline') {
                removeCharacterLength = 3;
                set = OrderedSet<string>(['UNDERLINE']);
                isCustomCommand = true;
            }

            if (isCustomCommand) {
                const currentSelection = editorState.getSelection();
                const contentState = editorState.getCurrentContent();
                const endOffset = currentSelection.getStartOffset();
                const startOffset = endOffset - removeCharacterLength;

                const newContentState = Modifier.replaceText(
                    contentState,
                    currentSelection.merge({
                        anchorOffset: startOffset,
                        focusOffset: endOffset,
                    }),
                    ' ',
                    set,
                );

                const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
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
