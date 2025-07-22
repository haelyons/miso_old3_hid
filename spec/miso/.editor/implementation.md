# Editor Implementation Details

## Flask Backend (Python)

### Dependencies
```python
from flask import Flask, jsonify, render_template, send_from_directory
import os
import markdown
import re
```

### Core Classes
```python
class SnippetLoader:
    def __init__(self, spec_root="spec"):
        self.spec_root = spec_root
    
    def scan_directory(self, path):
        # Walk directory tree, identify .md files and subdirectories
        # Return hierarchical structure with file paths
    
    def load_snippet(self, file_path):
        # Read markdown file
        # Extract title (# header) and summary (*emphasized text*)
        # Return dict with title, summary, content, children
```

### API Endpoints
```python
@app.route('/')
def index():
    # Serve main HTML page

@app.route('/api/snippet')
@app.route('/api/snippet/<path:snippet_path>')
def get_snippet(snippet_path=""):
    # CRITICAL: Handle empty path by defaulting to "miso.md"
    if snippet_path == "":
        snippet_path = "miso.md"
    
    # Load snippet content and return JSON
    # Include: title, summary, content, children, parent_path

@app.route('/static/<path:filename>')
def static_files(filename):
    # Serve CSS/JS files
```

## JavaScript Frontend

### Core Classes
```javascript
class SnippetEditor {
    constructor() {
        this.currentPath = "miso.md";
        this.contentView = document.getElementById('content-view');
        this.childView = document.getElementById('child-view');
    }
    
    async loadSnippet(path) {
        // Fetch snippet data from API
        // Update both content and child views
    }
    
    init() {
        // CRITICAL: Load miso.md as default root snippet
        this.loadSnippet("miso.md");
        // Setup mobile handlers, resize listeners
    }
    
    renderContent(snippet) {
        // Convert markdown to HTML using marked.js
        // Display in content view
    }
    
    renderChildren(children) {
        // Create clickable list of child snippets
        // Each shows title and one-line summary
    }
}
```

### Mobile Gestures
```javascript
class MobileHandler {
    constructor(editor) {
        this.editor = editor;
        this.touchStartX = 0;
        this.childViewVisible = false;
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }
    
    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        
        // Left swipe from right edge = show children
        // Right swipe from left edge = go to parent
    }
}
```

## File Structure
```
spec/miso/.editor/code/
├── app.py              # Flask server
├── templates/
│   └── index.html      # Main page template
├── static/
│   ├── style.css       # Responsive CSS
│   └── editor.js       # Frontend JavaScript
└── requirements.txt    # Python dependencies
```

## CSS Layout Strategy
```css
.editor-container {
    display: flex;
    height: 100vh;
}

.content-view {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.child-view {
    width: 300px;
    border-left: 1px solid #ccc;
    padding: 20px;
}

@media (max-width: 768px) {
    .child-view {
        position: fixed;
        right: -300px;
        transition: right 0.3s;
    }
    .child-view.visible {
        right: 0;
    }
}
```

## Observability Integration
```python
# CRITICAL: Add monitoring endpoints for agent access
@app.route('/api/monitor/screenshot')
def get_latest_screenshot():
    # Return path to latest screenshot from Playwright monitor
    # Agent can use Read tool to view the image file
    
@app.route('/api/monitor/state')  
def get_browser_state():
    # Return current browser state as JSON
    # URL, title, DOM snapshot, console logs
    
@app.route('/api/monitor/logs')
def get_interaction_logs():
    # Return recent user interaction history
    # Enable agent to see what user clicked/navigated
```

## Deployment Requirements
- Flask server must run from miso root directory for correct spec/ path resolution
- SnippetLoader initialized with "spec" as root directory
- Static files served from templates/ and static/ subdirectories
- Default snippet loading must handle both empty path and explicit "miso.md" requests