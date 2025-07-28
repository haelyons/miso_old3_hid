# implementation for changes feature

**Flask Backend Changes (app.py):**

```python
@app.route('/api/changes')
def get_recent_changes():
    """Return list of recently modified snippets with metadata"""
    spec_root = Path("spec")
    changes = []
    
    # Scan all .md files recursively
    for md_file in spec_root.rglob("*.md"):
        try:
            # Skip files in metafolders (directories starting with dot)
            if any(part.startswith('.') for part in md_file.parts):
                continue
                
            # Get modification time and extract metadata
            mod_time = os.path.getmtime(md_file)
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                title = extract_title(content)
                summary = extract_summary(content)
            
            relative_path = str(md_file.relative_to(spec_root))
            changes.append({
                'title': title,
                'summary': summary,
                'path': relative_path,
                'modified': mod_time,
                'modified_readable': format_date(mod_time)
            })
        except Exception:
            continue
    
    # Sort by modification time (newest first) and return top 20
    changes.sort(key=lambda x: x['modified'], reverse=True)
    return jsonify({'changes': changes[:20]})
```

**JavaScript Frontend Changes (editor.js):**

```javascript
// URL routing for /~recent
initializeFromURL() {
    const snippetPath = URLManager.urlToSnippetPath(window.location.href);
    
    if (snippetPath === null) {
        // Root URL - redirect to /miso
        window.history.replaceState({ snippetPath: 'miso.md', title: 'miso' }, 'miso', '/miso');
        this.loadSnippet('miso.md', false);
    } else if (snippetPath === '~recent') {
        // Special route for changes page
        this.loadChangesPage();
    } else {
        this.loadSnippet(snippetPath, false);
    }
}

// Changes page rendering
renderChangesPage(changes) {
    const breadcrumbsHtml = '<nav class="breadcrumbs"><div class="breadcrumb-trail"><span class="breadcrumb-current">Recent Changes</span></div></nav>';
    
    const changesHtml = changes.map(change => `
        <div class="child-item" onclick="editor.navigateToPath('${change.path}')">
            <div class="child-item-title">${change.title}</div>
            <div class="child-item-summary">${change.summary} • ${change.modified_readable}</div>
        </div>
    `).join('');
    
    this.contentView.innerHTML = breadcrumbsHtml + `
        <h1>recent changes</h1>
        <div class="child-view-inline">${changesHtml}</div>
    `;
    this.childView.innerHTML = '';
}

// Breadcrumbs with recent link
renderBreadcrumbs(segments) {
    const breadcrumbsHtml = segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const separator = index > 0 ? '<span class="breadcrumb-separator">></span>' : '';
        
        if (isLast) {
            return `${separator}<span class="breadcrumb-current">${segment.title}</span>`;
        } else {
            return `${separator}<a href="#" class="breadcrumb-link" data-path="${segment.path}">${segment.title}</a>`;
        }
    }).join('');
    
    // Add recent link only if we're not on the recent changes page
    const recentLinkHtml = this.currentPath !== '' ? 
        '<a href="#" class="recent-link" onclick="editor.navigateToRecent()">(recent)</a>' : '';
    
    return `<nav class="breadcrumbs">
        <div class="breadcrumb-trail">${breadcrumbsHtml}</div>
        ${recentLinkHtml}
    </nav>`;
}
```

**CSS Changes (style.css):**

```css
.breadcrumbs {
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #e1e4e8;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.breadcrumb-trail {
    flex-grow: 1;
}

.recent-link {
    color: #586069;
    text-decoration: none;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 3px;
    transition: background-color 0.2s;
}

.recent-link:hover {
    background-color: #f1f8ff;
    text-decoration: none;
}

.child-view-inline {
    background: #f6f8fa;
    padding: 20px;
    border-radius: 6px;
    margin-top: 20px;
}

.child-view-inline .child-item {
    background: white;
    margin-bottom: 10px;
}
```