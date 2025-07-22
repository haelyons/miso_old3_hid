class SnippetEditor {
    constructor() {
        this.currentPath = "miso.md";
        this.contentView = document.getElementById('content-view');
        this.childView = document.getElementById('child-view');
        this.mobileOverlay = document.getElementById('mobile-overlay');
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        // Load initial snippet
        this.loadSnippet("miso.md");
        
        // Setup mobile handlers
        if (this.isMobile) {
            this.setupMobileHandlers();
            this.addSwipeHint();
        }
        
        // Setup breadcrumb handlers
        this.setupBreadcrumbHandlers();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }
    
    async loadSnippet(path) {
        try {
            const response = await fetch(`/api/snippet/${path}`);
            if (!response.ok) {
                throw new Error('Snippet not found');
            }
            
            const snippet = await response.json();
            this.currentPath = path;
            
            this.renderContent(snippet);
            this.renderChildren(snippet);
            
        } catch (error) {
            console.error('Error loading snippet:', error);
            this.contentView.innerHTML = '<div class="error">Error loading snippet</div>';
        }
    }
    
    async renderContent(snippet) {
        const html = marked.parse(snippet.content);
        
        // Build and render breadcrumbs
        const segments = this.buildBreadcrumbTrail(this.currentPath);
        const titledSegments = await this.fetchBreadcrumbTitles(segments);
        const breadcrumbsHtml = this.renderBreadcrumbs(titledSegments);
        
        this.contentView.innerHTML = breadcrumbsHtml + html;
    }
    
    renderChildren(snippet) {
        const childrenHtml = snippet.children.map(child => `
            <div class="child-item" onclick="editor.navigateToChild('${child.path}')">
                <div class="child-item-title">${child.title}</div>
                <div class="child-item-summary">${child.summary}</div>
            </div>
        `).join('');
        
        const title = snippet.children.length > 0 ? 
            `<h3>Children (${snippet.children.length})</h3>` : 
            '<h3>No children</h3>';
        
        this.childView.innerHTML = title + childrenHtml;
    }
    
    navigateToChild(path) {
        this.loadSnippet(path);
        if (this.isMobile) {
            this.hideChildView();
        }
    }
    
    buildBreadcrumbTrail(currentPath) {
        // Parse path like "miso/agents/workflow.md" into segments
        if (currentPath === "miso.md") {
            return [{ title: "miso", path: "miso.md" }];
        }
        
        const segments = [];
        const parts = currentPath.split('/');
        
        // Always start with root
        segments.push({ title: "miso", path: "miso.md" });
        
        // Build intermediate segments (skip first if it's "miso" since we already added root)
        let buildPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
            if (i === 0 && parts[i] === "miso") {
                buildPath = parts[i];
                continue; // Skip adding root again
            }
            buildPath += (buildPath ? "/" : "") + parts[i];
            segments.push({ title: parts[i], path: buildPath + ".md" });
        }
        
        // Add current snippet
        const filename = parts[parts.length - 1];
        const title = filename.replace('.md', '');
        segments.push({ title: title, path: currentPath });
        
        return segments;
    }
    
    async fetchBreadcrumbTitles(segments) {
        // For each segment, fetch the actual snippet title
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
                
                if (this.isMobile) {
                    this.hideChildView();
                }
            }
        });
    }
    
    navigateUp() {
        // Navigate to parent by removing the last segment
        const pathParts = this.currentPath.split('/');
        if (pathParts.length > 1) {
            pathParts.pop(); // Remove filename
            pathParts.pop(); // Remove directory
            const parentPath = pathParts.join('/');
            this.loadSnippet(parentPath);
        } else {
            this.loadSnippet("miso.md");
        }
        
        if (this.isMobile) {
            this.hideChildView();
        }
    }
    
    setupMobileHandlers() {
        let touchStartX = 0;
        let touchStartY = 0;
        const swipeThreshold = 50;
        const edgeThreshold = 50;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
                
                // Left swipe from right edge - show child view
                if (deltaX < -swipeThreshold && touchStartX > window.innerWidth - edgeThreshold) {
                    this.showChildView();
                }
                
                // Right swipe from left edge - navigate to parent
                else if (deltaX > swipeThreshold && touchStartX < edgeThreshold) {
                    this.navigateUp();
                }
                
                // Right swipe when child view is visible - hide it
                else if (deltaX > swipeThreshold && this.childView.classList.contains('visible')) {
                    this.hideChildView();
                }
            }
        });
        
        // Close child view when overlay is tapped
        this.mobileOverlay.addEventListener('click', () => {
            this.hideChildView();
        });
    }
    
    showChildView() {
        this.childView.classList.add('visible');
        this.mobileOverlay.classList.add('visible');
    }
    
    hideChildView() {
        this.childView.classList.remove('visible');
        this.mobileOverlay.classList.remove('visible');
    }
    
    addSwipeHint() {
        // Show a temporary hint for mobile users
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.textContent = 'Swipe from right edge to see children';
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
        }, 4000);
    }
}

// Initialize editor when page loads
let editor;
document.addEventListener('DOMContentLoaded', () => {
    editor = new SnippetEditor();
});