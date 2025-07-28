# implementation for single-column layout

**HTML Changes (index.html):**
```html
<div class="editor-container">
    <div class="content-view" id="content-view">
        <div class="loading">Loading...</div>
    </div>
    <!-- Remove splitter div completely -->
    <div class="child-view" id="child-view">
        <div class="loading">Loading...</div>
    </div>
</div>
```

**CSS Changes (style.css):**
```css
.editor-container {
    display: flex;
    flex-direction: column; /* Changed from default row */
    height: 100vh;
}

.content-view {
    /* Remove flex: 1, min-width */
    width: 100%;
    padding: 40px;
    overflow-y: auto;
    background: #fff;
    margin-bottom: 20px; /* Add spacing before children */
}

.child-view {
    /* Remove width, min-width, flex-shrink */
    width: 100%;
    padding: 20px;
    background: #f6f8fa;
    overflow-y: auto;
}

/* Remove all .splitter styles */
```

**JavaScript Changes (editor.js):**
```javascript
// In constructor, remove splitter reference:
constructor() {
    // Remove: this.splitter = document.getElementById('splitter');
}

// In init(), remove resize setup:
init() {
    // Remove: if (!this.isMobile) { this.setupResizeHandlers(); }
}

// Remove entire setupResizeHandlers() method

// Update mobile handlers to remove child view overlay:
setupMobileHandlers() {
    // Keep parent navigation swipe
    // Remove child view show/hide functionality since always visible
}
```