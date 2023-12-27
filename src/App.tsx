import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useCallback, useState } from 'react';
import './App.css';

const App = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const handleKeyCommand = useCallback(
        (command: string) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);

            if (newState) {
                setEditorState(newState);
                return 'handled';
            }

            return 'not-handled';
        },
        [editorState],
    );

    return (
        <div className="playground-wrapper">
            <div className="navbar-container">
                <h3>
                    Demo editor by <span>Cherish Sachdeva</span>
                </h3>
                <button>Save</button>
            </div>
            <div className="editor-container">
                <Editor editorState={editorState} onChange={setEditorState} handleKeyCommand={handleKeyCommand} />
            </div>
        </div>
    );
};

export default App;
