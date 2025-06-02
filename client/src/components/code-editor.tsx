import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Check, RotateCcw } from "lucide-react";
import { setupMonaco } from "@/lib/monaco-setup";

interface CodeEditorProps {
  initialCode: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export function CodeEditor({
  initialCode,
  onChange,
  onRun,
  onSubmit,
  onReset,
  isRunning,
  isSubmitting
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'tests'>('code');

  useEffect(() => {
    if (!editorRef.current) return;

    // Import Monaco Editor dynamically
    const initMonaco = async () => {
      const monaco = await import('monaco-editor');
      setupMonaco();

      const editorInstance = monaco.editor.create(editorRef.current!, {
        value: initialCode,
        language: 'python',
        theme: 'pythonDark',
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'JetBrains Mono, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectionHighlight: false,
        cursorBlinking: 'smooth',
        cursorStyle: 'line',
        roundedSelection: false,
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
        }
      });

      editorInstance.onDidChangeModelContent(() => {
        onChange(editorInstance.getValue());
      });

      setEditor(editorInstance);
    };

    initMonaco();

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (editor && editor.getValue() !== initialCode) {
      editor.setValue(initialCode);
    }
  }, [initialCode, editor]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Editor Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'text-white bg-gray-700 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fas fa-file-code mr-2"></i>
            solution.py
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'tests'
                ? 'text-white bg-gray-700 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fas fa-flask mr-2"></i>
            Tests
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        {activeTab === 'code' ? (
          <div ref={editorRef} className="absolute inset-0" />
        ) : (
          <div className="p-4 text-gray-300 font-mono text-sm">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Test Cases</h4>
              <div className="space-y-2">
                <div className="text-gray-400"># Test cases will be run automatically</div>
                <div className="text-gray-400"># when you submit your solution</div>
                <div className="text-gray-400"># Click "Run Code" to see output</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onRun}
              disabled={isRunning}
              className={`bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 transform ${
                isRunning ? 'scale-105 animate-pulse' : 'hover:scale-105'
              }`}
            >
              {isRunning ? (
                <div className="animate-spin mr-2">
                  <Play className="w-4 h-4" />
                </div>
              ) : (
                <Play className="w-4 h-4 mr-2 transition-transform duration-200" />
              )}
              <span className="transition-all duration-200">
                {isRunning ? 'Running...' : 'Run Code'}
              </span>
            </Button>
            
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform ${
                isSubmitting ? 'scale-105 animate-pulse' : 'hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="animate-spin mr-2">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <Check className="w-4 h-4 mr-2 transition-transform duration-200" />
              )}
              <span className="transition-all duration-200">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </span>
            </Button>
            
            <Button
              onClick={onReset}
              variant="ghost"
              className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 mr-2 transition-transform duration-200 hover:rotate-180" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <span>Python 3.11</span>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
