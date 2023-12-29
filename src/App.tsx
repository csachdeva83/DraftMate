import {
    DraftHandleValue,
    Editor,
    EditorState,
    Modifier,
    RichUtils,
    convertFromRaw,
    convertToRaw,
    getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { OrderedSet } from 'immutable';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';
import './App.css';

const App = () => {
    const [savedState, setSavedState] = useLocalStorage('content', '');
    const [editorState, setEditorState] = useState(() => {
        const parsedString = JSON.parse(savedState);
        if (parsedString) {
            const contentState = convertFromRaw(parsedString);
            return EditorState.createWithContent(contentState);
        }

        return EditorState.createEmpty();
    });
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

    const customCommandMap = new Map<
        string,
        {
            removeCharacterLength: number;
            set: OrderedSet<string>;
        }
    >([
        [
            'heading',
            {
                removeCharacterLength: 1,
                set: OrderedSet<string>(['HEADING']),
            },
        ],
        [
            'bold',
            {
                removeCharacterLength: 2,
                set: OrderedSet<string>(['BOLD']),
            },
        ],
        [
            'red',
            {
                removeCharacterLength: 2,
                set: OrderedSet<string>(['RED']),
            },
        ],
        [
            'underline',
            {
                removeCharacterLength: 3,
                set: OrderedSet<string>(['UNDERLINE']),
            },
        ],
    ]);

    const handleKeyCommand = useCallback(
        (command: string): DraftHandleValue => {
            const customCommand = customCommandMap.get(command);

            if (customCommand) {
                const currentSelection = editorState.getSelection();
                const contentState = editorState.getCurrentContent();
                const endOffset = currentSelection.getStartOffset();
                const startOffset = endOffset - customCommand.removeCharacterLength;

                const newContentState = Modifier.replaceText(
                    contentState,
                    currentSelection.merge({
                        anchorOffset: startOffset,
                        focusOffset: endOffset,
                    }),
                    '\u200B',
                    customCommand.set,
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
            return 'heading';
        } else if (event.key === '*' && sequence === '') {
            setSequence('*');
        } else if (event.key === ' ' && sequence === '*') {
            setSequence('');
            return 'bold';
        } else if (event.key === '*' && sequence === '*') {
            setSequence('**');
        } else if (event.key === ' ' && sequence === '**') {
            setSequence('');
            return 'red';
        } else if (event.key === '*' && sequence === '**') {
            setSequence('***');
        } else if (event.key === ' ' && sequence === '***') {
            setSequence('');
            return 'underline';
        } else {
            setSequence('');
        }

        return getDefaultKeyBinding(event);
    };

    const saveEditorState = () => {
        const convertRaw = convertToRaw(editorState.getCurrentContent());
        setSavedState(JSON.stringify(convertRaw));
        toast.success('Your changes are being saved', {
            style: {
                background: 'green',
                color: 'white',
            },
        });
    };

    return (
        <div className="playground-wrapper">
            <div className="navbar-container">
                <h3>
                    Demo editor by <span>Cherish Sachdeva</span>
                </h3>
                <button onClick={saveEditorState}>Save</button>
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
