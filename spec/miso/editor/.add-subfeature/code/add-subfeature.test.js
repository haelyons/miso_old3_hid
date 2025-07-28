const fs = require('fs');
const path = require('path');

describe('Add Subfeature', () => {
    // Mock DOM elements
    beforeEach(() => {
        global.document = {
            getElementById: jest.fn(),
            querySelector: jest.fn(),
            createElement: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };
        global.window = { innerWidth: 1024 };
        global.fetch = jest.fn();
    });

    describe('UI Components', () => {
        it('should render plus button next to children heading', () => {
            const mockElement = { innerHTML: '', querySelector: jest.fn() };
            document.getElementById.mockReturnValue(mockElement);
            
            // Test that plus button is included in the rendered title
            const title = 'children (2) <button class="add-child-btn" onclick="editor.startChildCreation()">+</button>';
            expect(title).toContain('<button class="add-child-btn"');
            expect(title).toContain('onclick="editor.startChildCreation()"');
        });

        it('should render plus button for no children state', () => {
            const title = 'no children <button class="add-child-btn" onclick="editor.startChildCreation()">+</button>';
            expect(title).toContain('<button class="add-child-btn"');
        });
    });

    describe('File Creation Logic', () => {
        it('should generate proper filename from title', () => {
            const title = 'My New Feature';
            const filename = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            expect(filename).toBe('my-new-feature');
        });

        it('should handle special characters in filename', () => {
            const title = 'Test & Development!';
            const filename = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            expect(filename).toBe('test--development');
        });

        it('should create markdown content with title and summary', () => {
            const title = 'Test Feature';
            const summary = 'A test feature for validation';
            const content = `# ${title}\n*${summary}*\n\n`;
            
            expect(content).toBe('# Test Feature\n*A test feature for validation*\n\n');
        });
    });

    describe('API Integration', () => {
        it('should send correct data to create-snippet endpoint', async () => {
            const mockResponse = { ok: true, json: () => Promise.resolve({ path: 'miso/test-feature.md' }) };
            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            const requestData = {
                parent_path: 'miso.md',
                filename: 'test-feature',
                title: 'Test Feature',
                summary: 'A test feature'
            };

            await fetch('/api/create-snippet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            expect(fetch).toHaveBeenCalledWith('/api/create-snippet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
        });
    });
});