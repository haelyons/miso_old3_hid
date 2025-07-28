const { URLManager } = require('./breadcrumb-url');

describe('Breadcrumb URL Synchronization', () => {
    beforeEach(() => {
        // Mock window location
        global.window = {
            location: {
                origin: 'http://localhost:5000',
                href: 'http://localhost:5000/',
                pathname: '/'
            },
            history: {
                pushState: jest.fn(),
                replaceState: jest.fn(),
                state: null
            }
        };
        global.document = {
            title: ''
        };
    });

    describe('URL to Snippet Path Conversion', () => {
        it('should signal redirect for root URL', () => {
            const path = URLManager.urlToSnippetPath('http://localhost:5000/');
            expect(path).toBeNull(); // Signals redirect needed
        });

        it('should convert /miso URL to miso.md', () => {
            const path = URLManager.urlToSnippetPath('http://localhost:5000/miso');
            expect(path).toBe('miso.md');
        });

        it('should convert /miso/editor URL to miso/editor.md', () => {
            const path = URLManager.urlToSnippetPath('http://localhost:5000/miso/editor');
            expect(path).toBe('miso/editor.md');
        });

        it('should convert deep paths correctly', () => {
            const path = URLManager.urlToSnippetPath('http://localhost:5000/miso/editor/breadcrumbs');
            expect(path).toBe('miso/editor/breadcrumbs.md');
        });

        it('should handle trailing slashes', () => {
            const path = URLManager.urlToSnippetPath('http://localhost:5000/miso/editor/');
            expect(path).toBe('miso/editor.md');
        });
    });

    describe('Snippet Path to URL Conversion', () => {
        it('should convert miso.md to /miso URL', () => {
            const url = URLManager.snippetPathToUrl('miso.md');
            expect(url).toBe('/miso');
        });

        it('should convert miso/editor.md to /miso/editor', () => {
            const url = URLManager.snippetPathToUrl('miso/editor.md');
            expect(url).toBe('/miso/editor');
        });

        it('should convert deep paths correctly', () => {
            const url = URLManager.snippetPathToUrl('miso/editor/breadcrumbs.md');
            expect(url).toBe('/miso/editor/breadcrumbs');
        });
    });

    describe('URL Updates', () => {
        it('should update browser URL and title', () => {
            URLManager.updateURL('miso/editor.md', 'Editor');
            
            expect(window.history.pushState).toHaveBeenCalledWith(
                { snippetPath: 'miso/editor.md', title: 'Editor' },
                'Editor',
                '/miso/editor'
            );
            expect(document.title).toBe('Editor - miso');
        });

        it('should handle root path updates', () => {
            URLManager.updateURL('miso.md', 'miso');
            
            expect(window.history.pushState).toHaveBeenCalledWith(
                { snippetPath: 'miso.md', title: 'miso' },
                'miso',
                '/miso'
            );
            expect(document.title).toBe('miso - miso');
        });
    });

    describe('Bidirectional Conversion', () => {
        it('should maintain consistency in both directions', () => {
            const originalPath = 'miso/editor/breadcrumbs.md';
            const url = URLManager.snippetPathToUrl(originalPath);
            const convertedPath = URLManager.urlToSnippetPath('http://localhost:5000' + url);
            
            expect(convertedPath).toBe(originalPath);
        });

        it('should handle root path consistently', () => {
            const originalPath = 'miso.md';
            const url = URLManager.snippetPathToUrl(originalPath);
            const convertedPath = URLManager.urlToSnippetPath('http://localhost:5000' + url);
            
            expect(convertedPath).toBe(originalPath);
        });
    });
});