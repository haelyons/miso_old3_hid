/**
 * Test suite for WYSIWYG editor refinements
 * Testing the implementation of wysiwyg-rules.md requirements
 */

// Import the WYSIWYGEditor class from the main editor file
const fs = require('fs');
const path = require('path');

// Read the editor.js file to extract the WYSIWYGEditor class
const editorPath = path.join(__dirname, '../../../../../../spec/miso/.editor/code/static/editor.js');
const editorCode = fs.readFileSync(editorPath, 'utf8');

// Mock DOM environment
global.document = {
    createElement: jest.fn((tag) => {
        const element = {
            tagName: tag.toUpperCase(),
            className: '',
            innerHTML: '',
            textContent: '',
            appendChild: jest.fn(),
            replaceChild: jest.fn(),
            contains: jest.fn(() => false),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            remove: jest.fn(),
            style: {},
            dataset: {}
        };
        
        if (tag === 'div') {
            element.contentEditable = false;
        }
        
        return element;
    }),
    createRange: jest.fn(() => ({
        selectNodeContents: jest.fn(),
        collapse: jest.fn(),
        createContextualFragment: jest.fn(() => ({})),
        deleteContents: jest.fn(),
        insertNode: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
    })),
    createDocumentFragment: jest.fn(() => ({
        appendChild: jest.fn()
    })),
    createTextNode: jest.fn((text) => ({
        nodeType: 3, // TEXT_NODE
        textContent: text,
        parentNode: null
    })),
    body: {
        appendChild: jest.fn()
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
};

global.window = {
    getSelection: jest.fn(() => ({
        rangeCount: 0,
        isCollapsed: true,
        getRangeAt: jest.fn(() => ({})),
        removeAllRanges: jest.fn(),
        addRange: jest.fn()
    }))
};

global.Node = {
    TEXT_NODE: 3,
    ELEMENT_NODE: 1
};

// Mock marked parser
global.marked = {
    parse: jest.fn((content) => {
        // Simple markdown to HTML conversion for testing
        return content
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/gm, '<p>$1</p>');
    })
};

// Extract and evaluate the WYSIWYGEditor class
const classMatch = editorCode.match(/class WYSIWYGEditor \{[\s\S]*?\n\}/);
if (classMatch) {
    eval(classMatch[0]);
}

describe('WYSIWYG Editor Refinements', () => {
    let container, editor;

    beforeEach(() => {
        container = document.createElement('div');
        
        // Reset mocks
        jest.clearAllMocks();
        
        // Setup selection mock
        global.window.getSelection.mockReturnValue({
            rangeCount: 1,
            isCollapsed: false,
            getRangeAt: jest.fn(() => ({
                startContainer: { nodeType: Node.TEXT_NODE, textContent: 'test text' },
                startOffset: 5,
                toString: () => 'selected',
                getBoundingClientRect: () => ({ left: 100, top: 50 }),
                deleteContents: jest.fn(),
                insertNode: jest.fn(),
                extractContents: jest.fn(() => ({
                    textContent: 'selected text'
                }))
            })),
            removeAllRanges: jest.fn(),
            addRange: jest.fn()
        });
    });

    describe('Blank File Initialization', () => {
        it('should add blank line after summary for new files', () => {
            const newFileContent = "# Test Title\n*test summary*";
            editor = new WYSIWYGEditor(container, newFileContent);
            
            expect(marked.parse).toHaveBeenCalledWith("# Test Title\n*test summary*\n\n");
        });

        it('should set cursor to end for blank files', () => {
            const newFileContent = "# Test Title\n*test summary*";
            editor = new WYSIWYGEditor(container, newFileContent);
            
            // Verify setCursorToEnd was called (indirectly through the initialization)
            expect(document.createRange).toHaveBeenCalled();
        });
    });

    describe('Keyboard Shortcuts', () => {
        beforeEach(() => {
            editor = new WYSIWYGEditor(container, "# Test\n*summary*\n\nContent here");
        });

        it('should detect backtick code formatting', () => {
            const mockTextNode = {
                nodeType: Node.TEXT_NODE,
                textContent: 'test `code` here',
                parentNode: { replaceChild: jest.fn() }
            };
            
            global.window.getSelection.mockReturnValue({
                rangeCount: 1,
                getRangeAt: () => ({
                    startContainer: mockTextNode,
                    startOffset: 10
                })
            });

            editor.checkFormatShortcuts();
            
            expect(mockTextNode.parentNode.replaceChild).toHaveBeenCalled();
        });

        it('should detect double asterisk bold formatting', () => {
            const mockTextNode = {
                nodeType: Node.TEXT_NODE,
                textContent: 'test **bold** here',
                parentNode: { replaceChild: jest.fn() }
            };
            
            global.window.getSelection.mockReturnValue({
                rangeCount: 1,
                getRangeAt: () => ({
                    startContainer: mockTextNode,
                    startOffset: 12
                })
            });

            editor.checkFormatShortcuts();
            
            expect(mockTextNode.parentNode.replaceChild).toHaveBeenCalled();
        });

        it('should detect single asterisk italic formatting', () => {
            const mockTextNode = {
                nodeType: Node.TEXT_NODE,
                textContent: 'test *italic* here',
                parentNode: { replaceChild: jest.fn() }
            };
            
            global.window.getSelection.mockReturnValue({
                rangeCount: 1,
                getRangeAt: () => ({
                    startContainer: mockTextNode,
                    startOffset: 12
                })
            });

            editor.checkFormatShortcuts();
            
            expect(mockTextNode.parentNode.replaceChild).toHaveBeenCalled();
        });
    });

    describe('Auto-formatting', () => {
        beforeEach(() => {
            editor = new WYSIWYGEditor(container, "# Test\n*summary*\n\nContent here");
        });

        it('should convert "- " to bullet format automatically', () => {
            const mockTextNode = {
                nodeType: Node.TEXT_NODE,
                textContent: '- bullet item',
                parentNode: { replaceChild: jest.fn() }
            };
            
            global.window.getSelection.mockReturnValue({
                rangeCount: 1,
                getRangeAt: () => ({
                    commonAncestorContainer: mockTextNode
                })
            });

            editor.handleAutoFormatting();
            
            expect(mockTextNode.parentNode.replaceChild).toHaveBeenCalled();
        });

        it('should convert blank line to normal mode', () => {
            const mockTextNode = {
                nodeType: Node.TEXT_NODE,
                textContent: '',
                parentNode: { replaceChild: jest.fn() }
            };
            
            global.window.getSelection.mockReturnValue({
                rangeCount: 1,
                getRangeAt: () => ({
                    commonAncestorContainer: mockTextNode
                })
            });

            editor.handleEnterKey();
            
            expect(mockTextNode.parentNode.replaceChild).toHaveBeenCalled();
        });
    });

    describe('HTML to Markdown Conversion', () => {
        beforeEach(() => {
            editor = new WYSIWYGEditor(container, "# Test\n*summary*\n\nContent here");
        });

        it('should de-escape HTML entities', () => {
            const html = '<p>Test &lt;tag&gt; and &amp; symbol &quot;quote&quot;</p>';
            const markdown = editor.htmlToMarkdown(html);
            
            expect(markdown).toContain('<tag>');
            expect(markdown).toContain('& symbol');
            expect(markdown).toContain('"quote"');
        });

        it('should ensure single blank line between paragraphs', () => {
            const html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>';
            const markdown = editor.htmlToMarkdown(html);
            
            // Should have exactly one blank line between paragraphs
            expect(markdown).toMatch(/Paragraph 1\n\nParagraph 2\n\nParagraph 3/);
        });

        it('should ensure single blank line after headings', () => {
            const html = '<h1>Title</h1><p>Content</p>';
            const markdown = editor.htmlToMarkdown(html);
            
            expect(markdown).toMatch(/# Title\n\nContent/);
        });

        it('should put bullet items on newlines', () => {
            const html = '<li>Item 1</li><li>Item 2</li>';
            const markdown = editor.htmlToMarkdown(html);
            
            expect(markdown).toMatch(/- Item 1\n- Item 2/);
        });

        it('should convert formatting correctly', () => {
            const html = '<p>Text with <strong>bold</strong>, <em>italic</em>, and <code>code</code></p>';
            const markdown = editor.htmlToMarkdown(html);
            
            expect(markdown).toContain('**bold**');
            expect(markdown).toContain('*italic*');
            expect(markdown).toContain('`code`');
        });
    });

    describe('Format Popup Functionality', () => {
        beforeEach(() => {
            editor = new WYSIWYGEditor(container, "# Test\n*summary*\n\nContent here");
        });

        it('should show format popup on text selection', () => {
            editor.showFormatPopup();
            
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(document.body.appendChild).toHaveBeenCalled();
        });

        it('should apply normal formatting by removing HTML tags', () => {
            editor.currentSelection = {
                extractContents: jest.fn(() => ({
                    textContent: 'plain text'
                })),
                insertNode: jest.fn()
            };
            
            editor.removeFormatting();
            
            expect(editor.currentSelection.insertNode).toHaveBeenCalled();
        });
    });
});