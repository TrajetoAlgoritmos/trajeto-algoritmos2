'use client';

import CodeEditor from '@monaco-editor/react';

interface EditorProps {
  onChange: (value: string | undefined) => void;
  code: string | undefined;
  theme?: string;
}

function Editor({ onChange, code, theme }: EditorProps) {
  return (
    <CodeEditor
      height='100%'
      theme={theme ?? 'vs-dark'}
      language='c'
      value={code ?? ''}
      className='rounded-m flex-1 min-h-[70vh]'
      onChange={onChange}
    />
  );
}
export default Editor;
