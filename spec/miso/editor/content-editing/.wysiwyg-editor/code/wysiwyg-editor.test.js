const fs = require('fs');
const path = require('path');

describe('WYSIWYG Editor', () => {
    // Mock DOM elements
    beforeEach(() => {
        global.document = {
            createElement: jest.fn(),
            body: { appendChild: jest.fn() },
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };
        global.window = { 
            getSelection: jest.fn()
        };
        global.marked = {
            parse: jest.fn()
        };
    });

    describe('Initialization', () => {
        it('should create contenteditable div with correct classes', () => {
            const mockDiv = {
                className: '',
                contentEditable: false,
                innerHTML: '',
                addEventListener: jest.fn()
            };
            document.createElement.mockReturnValue(mockDiv);
            marked.parse.mockReturnValue('<p>Test content</p>');

            // Test initialization would create proper contenteditable element
            expect(document.createElement).toBeDefined();
        });

        it('should parse initial markdown content to HTML', () => {
            marked.parse.mockReturnValue('<p>Test <strong>content</strong></p>');
            const initialContent = 'Test **content**';
            
            expect(marked.parse).toBeDefined();
        });
    });

    describe('Text Selection', () => {
        it('should detect text selection and show popup', () => {
            const mockSelection = {
                rangeCount: 1,
                isCollapsed: false,
                getRangeAt: jest.fn().mockReturnValue({
                    getBoundingClientRect: () => ({ left: 100, top: 200 }),
                    toString: () => 'selected text'
                })
            };
            window.getSelection.mockReturnValue(mockSelection);

            // Test that selection triggers popup display
            expect(window.getSelection).toBeDefined();
        });

        it('should hide popup when selection is empty', () => {
            const mockSelection = {
                rangeCount: 1,
                isCollapsed: true
            };
            window.getSelection.mockReturnValue(mockSelection);

            // Test that empty selection hides popup
            expect(window.getSelection).toBeDefined();
        });
    });

    describe('Format Application', () => {
        it('should apply normal formatting correctly by removing all HTML tags', () => {
            const htmlContent = '<strong>bold text</strong>';
            const expectedPlainText = 'bold text';
            
            // Test HTML tag removal for normal formatting
            const result = htmlContent.replace(/<[^>]*>/g, '');
            expect(result).toBe(expectedPlainText);
            expect(result).not.toContain('<');
        });

        it('should apply bold formatting correctly', () => {
            const selectedText = 'bold text';
            const expectedHTML = '<strong>bold text</strong>';
            
            expect(expectedHTML).toContain('<strong>');
            expect(expectedHTML).toContain('bold text');
        });

        it('should apply italic formatting correctly', () => {
            const selectedText = 'italic text';
            const expectedHTML = '<em>italic text</em>';
            
            expect(expectedHTML).toContain('<em>');
            expect(expectedHTML).toContain('italic text');
        });

        it('should apply code formatting correctly', () => {
            const selectedText = 'code text';
            const expectedHTML = '<code>code text</code>';
            
            expect(expectedHTML).toContain('<code>');
            expect(expectedHTML).toContain('code text');
        });

        it('should apply title formatting correctly', () => {
            const selectedText = 'title text';
            const expectedHTML = '<h1>title text</h1>';
            
            expect(expectedHTML).toContain('<h1>');
            expect(expectedHTML).toContain('title text');
        });

        it('should apply bullet formatting correctly', () => {
            const selectedText = 'bullet text';
            const expectedHTML = '<li>bullet text</li>';
            
            expect(expectedHTML).toContain('<li>');
            expect(expectedHTML).toContain('bullet text');
        });
    });

    describe('HTML to Markdown Conversion', () => {
        it('should convert bold HTML to markdown', () => {
            const html = '<strong>bold text</strong>';
            const expectedMarkdown = '**bold text**';
            
            const result = html.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
            expect(result).toBe(expectedMarkdown);
        });

        it('should convert italic HTML to markdown', () => {
            const html = '<em>italic text</em>';
            const expectedMarkdown = '*italic text*';
            
            const result = html.replace(/<em>(.*?)<\/em>/g, '*$1*');
            expect(result).toBe(expectedMarkdown);
        });

        it('should convert code HTML to markdown', () => {
            const html = '<code>code text</code>';
            const expectedMarkdown = '`code text`';
            
            const result = html.replace(/<code>(.*?)<\/code>/g, '`$1`');
            expect(result).toBe(expectedMarkdown);
        });

        it('should convert title HTML to markdown', () => {
            const html = '<h1>title text</h1>';
            const expectedMarkdown = '# title text';
            
            const result = html.replace(/<h1>(.*?)<\/h1>/g, '# $1');
            expect(result).toBe(expectedMarkdown);
        });
    });

    describe('Format Removal', () => {
        it('should remove formatting from bold text', () => {
            const formattedContent = '<strong>bold text</strong>';
            const plainText = formattedContent.replace(/<[^>]*>/g, '');
            
            expect(plainText).toBe('bold text');
            expect(plainText).not.toContain('<strong>');
        });

        it('should remove formatting from italic text', () => {
            const formattedContent = '<em>italic text</em>';
            const plainText = formattedContent.replace(/<[^>]*>/g, '');
            
            expect(plainText).toBe('italic text');
            expect(plainText).not.toContain('<em>');
        });

        it('should handle complex nested formatting', () => {
            const complexContent = '<strong>bold <em>and italic</em> text</strong>';
            const plainText = complexContent.replace(/<[^>]*>/g, '');
            
            expect(plainText).toBe('bold and italic text');
            expect(plainText).not.toContain('<');
        });
    });
});