// apps/ngrid-docs-app/build/stub-domino.js
module.exports = {
    createDocument: () => document,
    createWindow: () => window,
    createDocumentFragment: () => document.createDocumentFragment(),
    createElement: (tagName) => document.createElement(tagName),
    createTextNode: (text) => document.createTextNode(text),
    // Add more as needed based on dependency requirements
};