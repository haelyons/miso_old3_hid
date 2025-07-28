# implementation
*technical implementation details for add-subfeature functionality*

**HTML Template Modification:**
Modify the `renderChildren()` method in `editor.js` to include a plus button in the heading:

```javascript
const title = snippet.children.length > 0 ? 
    `<h3>children (${snippet.children.length}) <button class="add-child-btn" onclick="editor.startChildCreation()">+</button></h3>` : 
    '<h3>no children <button class="add-child-btn" onclick="editor.startChildCreation()">+</button></h3>';
```

**CSS Styling:**
```css
.add-child-btn {
    background: #007acc;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin-left: 8px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
}

.add-child-btn:hover {
    background: #005a9e;
}

.editing-child {
    border: 2px solid #007acc;
    padding: 12px;
    margin-bottom: 8px;
    background: #f8f9fa;
}

.editing-child input {
    width: 100%;
    padding: 8px;
    margin: 4px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}
```

**JavaScript Implementation:**
```javascript
class SnippetEditor {
    constructor() {
        this.isEditing = false;
        // ... existing constructor code
    }

    startChildCreation() {
        if (this.isEditing) return;
        this.isEditing = true;
        
        const editingChild = document.createElement('div');
        editingChild.className = 'child-item editing-child';
        editingChild.innerHTML = `
            <input type="text" id="new-child-title" placeholder="Enter title..." />
            <input type="text" id="new-child-summary" placeholder="Enter summary..." />
        `;
        
        const childView = document.getElementById('child-view');
        const firstChild = childView.querySelector('.child-item');
        if (firstChild) {
            childView.insertBefore(editingChild, firstChild);
        } else {
            childView.appendChild(editingChild);
        }
        
        this.setupEditHandlers();
        document.getElementById('new-child-title').focus();
    }

    setupEditHandlers() {
        const titleInput = document.getElementById('new-child-title');
        const summaryInput = document.getElementById('new-child-summary');
        
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                summaryInput.focus();
            } else if (e.key === 'Escape') {
                this.cancelChildCreation();
            }
        });
        
        summaryInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveNewChild();
            } else if (e.key === 'Escape') {
                this.cancelChildCreation();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.editing-child') && !e.target.closest('.add-child-btn')) {
                this.cancelChildCreation();
            }
        });
    }

    async saveNewChild() {
        const title = document.getElementById('new-child-title').value.trim();
        const summary = document.getElementById('new-child-summary').value.trim();
        
        if (!title || !summary) return;
        
        const filename = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        try {
            const response = await fetch('/api/create-snippet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parent_path: this.currentPath,
                    filename: filename,
                    title: title,
                    summary: summary
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.cancelChildCreation();
                await this.loadSnippet(result.path);
                // Automatically enter edit mode for the new snippet
                setTimeout(() => this.startContentEditing(), 100);
            }
        } catch (error) {
            console.error('Error creating snippet:', error);
        }
    }

    cancelChildCreation() {
        const editingChild = document.querySelector('.editing-child');
        if (editingChild) {
            editingChild.remove();
        }
        this.isEditing = false;
        document.removeEventListener('click', this.cancelChildCreation);
    }
}
```

**Flask API Endpoint:**
```python
@app.route('/api/create-snippet', methods=['POST'])
def create_snippet():
    data = request.get_json()
    parent_path = data['parent_path']
    filename = data['filename']
    title = data['title']
    summary = data['summary']
    
    # Determine target directory
    if parent_path == "miso.md":
        target_dir = Path("spec/miso")
    else:
        target_dir = Path("spec") / Path(parent_path).parent / Path(parent_path).stem
    
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Create new file
    new_file_path = target_dir / f"{filename}.md"
    content = f"# {title}\n*{summary}*\n\n"
    
    with open(new_file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return jsonify({'path': str(new_file_path.relative_to("spec"))})
```