const editor = {
  create: () => ({
    dispose: () => {},
    getValue: () => 'testValue',
    layout: () => {},
    onDidChangeModelContent: () => {},
  }),
};

const monaco = {
  editor,
};

module.exports = monaco;
