# implementation
*technical implementation details for WYSIWYG editor functionality*

**CSS Styling:**
```css
.wysiwyg-editor {
    width: 100%;
    min-height: 400px;
    padding: 16px;
    border: 1px solid #d1d9e0;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    background: #fff;
    outline: none;
}

.wysiwyg-editor:focus {
    border-color: #0366d6;
    box-shadow: 0 0 0 2px rgba(3, 102, 214, 0.2);
}

.format-popup {
    position: absolute;
    background: white;
    border: 1px solid #d1d9e0;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    gap: 4px;
    padding: 4px;
    z-index: 1000;
}

.format-btn {
    padding: 6px 10px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #24292e;
}

.format-btn:hover {
    background: #f6f8fa;
}
```

**JavaScript WYSIWYG Implementation:**
```javascript
class WYSIWYGEditor {
    constructor(container, initialContent) {
        this.container = container;
        this.popup = null;
        this.currentSelection = null;
        this.init(initialContent);
    }

    init(content) {
        // Create contenteditable div
        this.editor = document.createElement('div');
        this.editor.className = 'wysiwyg-editor';
        this.editor.contentEditable = true;
        this.editor.innerHTML = marked.parse(content);
        
        this.container.appendChild(this.editor);
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.editor.addEventListener('mouseup', () => this.handleSelection());
        this.editor.addEventListener('keyup', () => this.handleSelection());
        document.addEventListener('mousedown', (e) => this.handleClickOutside(e));
    }

    handleSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            this.currentSelection = selection.getRangeAt(0);
            this.showFormatPopup();
        } else {
            this.hideFormatPopup();
        }
    }

    showFormatPopup() {
        if (this.popup) this.hideFormatPopup();
        
        this.popup = document.createElement('div');
        this.popup.className = 'format-popup';
        this.popup.innerHTML = `
            <button class="format-btn" data-format="normal">Normal</button>
            <button class="format-btn" data-format="bold">B</button>
            <button class="format-btn" data-format="italic">I</button>
            <button class="format-btn" data-format="code">Code</button>
            <button class="format-btn" data-format="title">H1</button>
            <button class="format-btn" data-format="bullet">•</button>
        `;
        
        // Position popup near selection
        const rect = this.currentSelection.getBoundingClientRect();
        this.popup.style.left = rect.left + 'px';
        this.popup.style.top = (rect.top - 40) + 'px';
        
        document.body.appendChild(this.popup);
        
        // Add format handlers
        this.popup.addEventListener('click', (e) => {
            const format = e.target.dataset.format;
            if (format) this.applyFormat(format);
        });
    }

    applyFormat(format) {
        if (!this.currentSelection) return;
        
        const selectedText = this.currentSelection.toString();
        let formattedText;
        
        if (format === 'normal') {
            // Special handling for normal format - remove all formatting
            this.removeFormatting();
        } else {
            switch (format) {
                case 'bold':
                    formattedText = `<strong>${selectedText}</strong>`;
                    break;
                case 'italic':
                    formattedText = `<em>${selectedText}</em>`;
                    break;
                case 'code':
                    formattedText = `<code>${selectedText}</code>`;
                    break;
                case 'title':
                    formattedText = `<h1>${selectedText}</h1>`;
                    break;
                case 'bullet':
                    formattedText = `<li>${selectedText}</li>`;
                    break;
            }
            
            this.currentSelection.deleteContents();
            this.currentSelection.insertNode(document.createRange().createContextualFragment(formattedText));
        }
    }

    removeFormatting() {
        // Get the selected content including any HTML tags
        const range = this.currentSelection;
        const selectedContent = range.extractContents();
        
        // Create a temporary div to process the content
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(selectedContent);
        
        // Extract just the text content, removing all HTML tags
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Insert the plain text back
        const textNode = document.createTextNode(plainText);
        range.insertNode(textNode);
        
        // Clear selection
        window.getSelection().removeAllRanges();
        
        this.hideFormatPopup();
    }

    hideFormatPopup() {
        if (this.popup) {
            this.popup.remove();
            this.popup = null;
        }
    }

    getMarkdown() {
        // Convert HTML back to markdown
        return this.htmlToMarkdown(this.editor.innerHTML);
    }

    htmlToMarkdown(html) {
        return html
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<code>(.*?)<\/code>/g, '`$1`')
            .replace(/<h1>(.*?)<\/h1>/g, '# $1')
            .replace(/<li>(.*?)<\/li>/g, '- $1')
            .replace(/<[^>]*>/g, ''); // Strip remaining HTML
    }
}
```

**Integration with Content Editing:**
```javascript
// Modify startContentEditing in editor.js
startContentEditing() {
    if (this.isEditingContent) return;
    this.isEditingContent = true;
    
    this.originalContent = this.currentSnippet.content;
    
    // Update buttons first
    const editButton = document.querySelector('.inline-edit-btn');
    if (editButton) {
        editButton.outerHTML = `
            <span class="edit-button-group">
                <button class="edit-btn save inline-edit-btn" onclick="editor.saveContentChanges()">Save</button>
                <button class="edit-btn cancel inline-edit-btn" onclick="editor.cancelContentEditing()">Cancel</button>
            </span>
        `;
    }
    
    // Replace rendered content with WYSIWYG editor
    const renderedContent = document.querySelector('.rendered-content');
    renderedContent.innerHTML = '';
    
    this.wysiwygEditor = new WYSIWYGEditor(renderedContent, this.originalContent);
}

// Update saveContentChanges to get content from WYSIWYG
async saveContentChanges() {
    const newContent = this.wysiwygEditor ? 
        this.wysiwygEditor.getMarkdown() : 
        document.querySelector('.content-textarea').value;
    
    // ... rest of save logic
}
```