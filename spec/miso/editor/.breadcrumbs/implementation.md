# Breadcrumbs Implementation Details

## JavaScript Classes and Methods

### SnippetEditor Extensions
```javascript
class SnippetEditor {
    buildBreadcrumbTrail(currentPath) {
        // Parse path like "miso/agents/workflow.md" into segments
        if (currentPath === "miso.md") return [{ title: "miso", path: "miso.md" }];
        
        const segments = [];
        const parts = currentPath.split('/');
        
        // Always start with root
        segments.push({ title: "miso", path: "miso.md" });
        
        // Build intermediate segments (skip first if it's "miso" since we already added root)
        let buildPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
            if (i === 0 && parts[i] === "miso") {
                buildPath = parts[i];
                continue; // Skip adding root again to avoid duplicate
            }
            buildPath += (buildPath ? "/" : "") + parts[i];
            // Need to fetch title from snippet - will be async
            segments.push({ title: parts[i], path: buildPath + ".md" });
        }
        
        // Add current snippet
        const filename = parts[parts.length - 1];
        const title = filename.replace('.md', '');
        segments.push({ title: title, path: currentPath });
        
        return segments;
    }
    
    async fetchBreadcrumbTitles(segments) {
        // For each segment, fetch the actual snippet title instead of using filename
        const promises = segments.map(async (segment, index) => {
            if (index === 0) return { ...segment, title: "miso" }; // Root is always "miso"
            
            try {
                const response = await fetch(`/api/snippet/${segment.path}`);
                const data = await response.json();
                return { ...segment, title: data.title };
            } catch {
                return segment; // Fallback to filename if fetch fails
            }
        });
        
        return Promise.all(promises);
    }
    
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
        
        return `<nav class="breadcrumbs">${breadcrumbsHtml}</nav>`;
    }
    
    setupBreadcrumbHandlers() {
        // Delegate click handling for breadcrumb links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('breadcrumb-link')) {
                e.preventDefault();
                const path = e.target.dataset.path;
                this.loadSnippet(path);
            }
        });
    }
}
```

## CSS Styling
```css
.breadcrumbs {
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #e1e4e8;
    font-size: 0.9rem;
}

.breadcrumb-link {
    color: #0366d6;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 3px;
    transition: background-color 0.2s;
}

.breadcrumb-link:hover {
    background-color: #f1f8ff;
    text-decoration: underline;
}

.breadcrumb-separator {
    margin: 0 8px;
    color: #586069;
    font-weight: normal;
}

.breadcrumb-current {
    color: #24292e;
    font-weight: 600;
    padding: 4px 8px;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .breadcrumbs {
        font-size: 0.8rem;
        margin-bottom: 15px;
    }
    
    .breadcrumb-separator {
        margin: 0 4px;
    }
}
```

## Integration with Existing Editor
```javascript
// Modify renderContent method
renderContent(snippet) {
    // Build and render breadcrumbs
    const segments = this.buildBreadcrumbTrail(this.currentPath);
    this.fetchBreadcrumbTitles(segments).then(titledSegments => {
        const breadcrumbsHtml = this.renderBreadcrumbs(titledSegments);
        const contentHtml = marked.parse(snippet.content);
        
        // Replace old navigation with breadcrumbs
        this.contentView.innerHTML = breadcrumbsHtml + contentHtml;
    });
}

// Remove old navigation code
// OLD: navigationHtml with "← Back to parent" button
// NEW: Breadcrumbs handle all navigation
```

## Flask Backend Requirements
No backend changes required - breadcrumbs use existing `/api/snippet/<path>` endpoints to fetch titles for path segments.

## Testing Scenarios
1. Root snippet (miso.md) shows just "miso" 
2. Second level (miso/agents.md) shows "miso > agents"
3. Deep nesting (miso/agents/workflow.md) shows "miso > agents > workflow"
4. Clicking any breadcrumb navigates correctly
5. Mobile layout doesn't break with long paths