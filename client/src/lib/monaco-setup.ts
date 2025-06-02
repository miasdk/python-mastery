import * as monaco from 'monaco-editor';

// Configure Monaco environment for web workers
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './monaco-editor/esm/vs/language/json/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './monaco-editor/esm/vs/language/css/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './monaco-editor/esm/vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './monaco-editor/esm/vs/language/typescript/ts.worker.js';
    }
    return './monaco-editor/esm/vs/editor/editor.worker.js';
  }
};

export function setupMonaco() {
  // Configure Monaco Editor for Python
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  
  // Python language configuration
  monaco.languages.register({ id: 'python' });
  
  // Set up Python syntax highlighting
  monaco.languages.setMonarchTokensProvider('python', {
    tokenizer: {
      root: [
        [/[a-z_$][\w$]*/, { cases: { 
          '@keywords': 'keyword',
          '@builtins': 'type.identifier',
          '@default': 'identifier' 
        }}],
        [/[A-Z][\w\$]*/, 'type.identifier'],
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, { cases: { 
          '@operators': 'operator',
          '@default': '' 
        }}],
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
        [/[;,.]/, 'delimiter'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
        [/'/, { token: 'string.quote', bracket: '@open', next: '@stringSingle' }],
        [/#.*/, 'comment'],
      ],
      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape.invalid'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
      stringSingle: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape.invalid'],
        [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
    },
    keywords: [
      'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else',
      'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
      'is', 'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while',
      'with', 'yield', 'True', 'False', 'None'
    ],
    builtins: [
      'abs', 'all', 'any', 'bin', 'bool', 'chr', 'dict', 'dir', 'enumerate',
      'filter', 'float', 'int', 'len', 'list', 'map', 'max', 'min', 'range',
      'reversed', 'round', 'set', 'sorted', 'str', 'sum', 'tuple', 'type', 'zip'
    ],
    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
      '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=', '>>>='
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.bracket' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
  });

  // Configure editor themes
  monaco.editor.defineTheme('pythonDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569cd6' },
      { token: 'type.identifier', foreground: '4ec9b0' },
      { token: 'string', foreground: 'ce9178' },
      { token: 'number', foreground: 'b5cea8' },
      { token: 'comment', foreground: '6a9955' },
      { token: 'operator', foreground: 'd4d4d4' },
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#2d2d30',
      'editor.selectionBackground': '#264f78',
    }
  });

  return monaco;
}
