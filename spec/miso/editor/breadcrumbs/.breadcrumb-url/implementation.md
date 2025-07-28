# implementation
*technical implementation details for breadcrumb-url synchronization*

**Flask Route Updates:**
```python
@app.route('/')
@app.route('/<path:snippet_path>')
def index(snippet_path=""):
    # Serve the same HTML but let JavaScript handle routing
    return render_template('index.html')
```

**JavaScript URL Utilities:**
```javascript
class URLManager {
    static urlToSnippetPath(url) {
        const path = new URL(url, window.location.origin).pathname;
        const cleanPath = path.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
        
        if (!cleanPath || cleanPath === 'miso') {
            return 'miso.md';
        }
        
        return cleanPath + '.md';
    }
    
    static snippetPathToUrl(snippetPath) {
        const pathWithoutExt = snippetPath.replace(/\.md$/, '');
        
        if (pathWithoutExt === 'miso') {
            return '/';
        }
        
        return '/' + pathWithoutExt;
    }
    
    static updateURL(snippetPath, title) {
        const url = URLManager.snippetPathToUrl(snippetPath);
        const state = { snippetPath, title };
        
        window.history.pushState(state, title, url);
        document.title = `${title} - miso`;
    }
}
```

**Updated SnippetEditor Class:**
```javascript
class SnippetEditor {
    constructor() {
        // ... existing constructor code
        this.setupURLHandlers();
        this.initializeFromURL();
    }
    
    initializeFromURL() {
        const snippetPath = URLManager.urlToSnippetPath(window.location.href);
        this.loadSnippet(snippetPath, false); // false = don't update URL
    }
    
    setupURLHandlers() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.snippetPath) {
                this.loadSnippet(event.state.snippetPath, false);
            } else {
                this.initializeFromURL();
            }
        });
    }
    
    async loadSnippet(path, updateURL = true) {
        try {
            const response = await fetch(`/api/snippet/${path}`);
            if (!response.ok) {
                throw new Error('Snippet not found');
            }
            
            const snippet = await response.json();
            this.currentPath = path;
            this.currentSnippet = snippet;
            
            this.renderContent(snippet);
            this.renderChildren(snippet);
            
            // Update URL and page title
            if (updateURL) {
                URLManager.updateURL(path, snippet.title);
            }
            
        } catch (error) {
            console.error('Error loading snippet:', error);
            this.contentView.innerHTML = '<div class="error">Error loading snippet</div>';
        }
    }
    
    navigateToChild(path) {
        this.loadSnippet(path); // This will update URL automatically
    }
}
```

**Updated Breadcrumb Handling:**
```javascript
setupBreadcrumbHandlers() {
    // Delegate click handling for breadcrumb links
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('breadcrumb-link')) {
            e.preventDefault();
            const path = e.target.dataset.path;
            this.loadSnippet(path); // This will update URL automatically
        }
    });
}
```

**Initial State Setup:**
```javascript
// Update initialization to handle URL routing
document.addEventListener('DOMContentLoaded', () => {
    editor = new SnippetEditor();
    
    // Set initial history state if none exists
    if (!window.history.state) {
        const snippetPath = URLManager.urlToSnippetPath(window.location.href);
        window.history.replaceState(
            { snippetPath, title: 'miso' }, 
            'miso', 
            window.location.pathname
        );
    }
});
```