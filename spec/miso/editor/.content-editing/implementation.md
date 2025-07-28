# implementation
*technical implementation details for content editing functionality*

**CSS Styling:**
```css
.content-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.edit-btn {
    background: #f6f8fa;
    border: 1px solid #d1d9e0;
    color: #24292e;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.edit-btn:hover {
    background: #e1e7ed;
    border-color: #c9d1d9;
}

.edit-btn.save {
    background: #2ea043;
    color: white;
    border-color: #2ea043;
}

.edit-btn.save:hover {
    background: #2c974b;
}

.edit-btn.cancel {
    background: #da3633;
    color: white;
    border-color: #da3633;
    margin-left: 8px;
}

.edit-btn.cancel:hover {
    background: #c93c37;
}

.content-textarea {
    width: 100%;
    min-height: 400px;
    padding: 16px;
    border: 1px solid #d1d9e0;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
}

.content-textarea:focus {
    outline: none;
    border-color: #0366d6;
    box-shadow: 0 0 0 2px rgba(3, 102, 214, 0.2);
}
```

**HTML Template Modification:**
Modify `renderContent()` method to wrap content with header containing edit button:

```javascript
async renderContent(snippet) {
    const html = marked.parse(snippet.content);
    
    const segments = this.buildBreadcrumbTrail(this.currentPath);
    const titledSegments = await this.fetchBreadcrumbTitles(segments);
    const breadcrumbsHtml = this.renderBreadcrumbs(titledSegments);
    
    const editButton = `<button class="edit-btn" onclick="editor.startContentEditing()">Edit</button>`;
    const contentHeader = `<div class="content-header"><div></div>${editButton}</div>`;
    
    this.contentView.innerHTML = breadcrumbsHtml + contentHeader + `<div class="rendered-content">${html}</div>`;
}
```

**JavaScript Implementation:**
```javascript
class SnippetEditor {
    constructor() {
        // ... existing constructor code
        this.isEditingContent = false;
        this.originalContent = '';
    }

    startContentEditing() {
        if (this.isEditingContent) return;
        this.isEditingContent = true;
        
        // Store original content for cancellation
        this.originalContent = this.currentSnippet.content;
        
        // Replace rendered content with textarea
        const renderedContent = document.querySelector('.rendered-content');
        const textarea = document.createElement('textarea');
        textarea.className = 'content-textarea';
        textarea.value = this.originalContent;
        
        renderedContent.innerHTML = '';
        renderedContent.appendChild(textarea);
        
        // Update buttons
        const editButton = document.querySelector('.edit-btn');
        editButton.outerHTML = `
            <div>
                <button class="edit-btn save" onclick="editor.saveContentChanges()">Save</button>
                <button class="edit-btn cancel" onclick="editor.cancelContentEditing()">Cancel</button>
            </div>
        `;
        
        textarea.focus();
    }

    async saveContentChanges() {
        const textarea = document.querySelector('.content-textarea');
        const newContent = textarea.value;
        
        if (!newContent.trim()) return;
        
        try {
            const response = await fetch('/api/update-snippet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: this.currentPath,
                    content: newContent
                })
            });
            
            if (response.ok) {
                // Update current snippet data
                this.currentSnippet.content = newContent;
                this.exitContentEditing();
                
                // Re-render with updated content
                this.renderContent(this.currentSnippet);
            }
        } catch (error) {
            console.error('Error saving content:', error);
        }
    }

    cancelContentEditing() {
        this.exitContentEditing();
        this.renderContent(this.currentSnippet);
    }

    exitContentEditing() {
        this.isEditingContent = false;
        this.originalContent = '';
    }
}
```

**Flask API Endpoint:**
```python
@app.route('/api/update-snippet', methods=['POST'])
def update_snippet():
    """Update snippet content"""
    data = request.get_json()
    snippet_path = data['path']
    new_content = data['content']
    
    full_path = Path("spec") / snippet_path
    
    if not full_path.exists():
        return jsonify({'error': 'Snippet not found'}), 404
    
    try:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```