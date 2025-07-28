class URLManager {
    static urlToSnippetPath(url) {
        const path = new URL(url, window.location.origin).pathname;
        const cleanPath = path.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
        
        if (!cleanPath) {
            // Auto-redirect root to /miso
            return null; // Signal that we need to redirect
        }
        
        if (cleanPath === '~recent') {
            return '~recent'; // Special case for changes page
        }
        
        if (cleanPath === 'miso') {
            return 'miso.md';
        }
        
        return cleanPath + '.md';
    }
    
    static snippetPathToUrl(snippetPath) {
        const pathWithoutExt = snippetPath.replace(/\.md$/, '');
        
        return '/' + pathWithoutExt;
    }
    
    static updateURL(snippetPath, title) {
        const url = URLManager.snippetPathToUrl(snippetPath);
        const state = { snippetPath, title };
        
        window.history.pushState(state, title, url);
        document.title = `${title} - miso`;
    }
}

class SnippetEditor {
    constructor() {
        this.currentPath = "miso.md";
        this.contentView = document.getElementById('content-view');
        this.childView = document.getElementById('child-view');
        this.mobileOverlay = document.getElementById('mobile-overlay');
        this.isMobile = window.innerWidth <= 768;
        this.isEditing = false;
        this.isEditingContent = false;
        this.originalContent = '';
        this.currentSnippet = null;
        
        this.init();
    }
    
    init() {
        // Setup URL handling first
        this.setupURLHandlers();
        
        // Initialize from current URL
        this.initializeFromURL();
        
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

    initializeFromURL() {
        const snippetPath = URLManager.urlToSnippetPath(window.location.href);
        
        if (snippetPath === null) {
            // Root URL detected, redirect to /miso
            window.history.replaceState({ snippetPath: 'miso.md', title: 'miso' }, 'miso', '/miso');
            this.loadSnippet('miso.md', false);
        } else if (snippetPath === '~recent') {
            // Special route for changes page
            this.loadChangesPage();
        } else {
            this.loadSnippet(snippetPath, false); // false = don't update URL
        }
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
            
            // Update URL and page title
            if (updateURL) {
                URLManager.updateURL(path, snippet.title);
            }
            
            // Scroll to top immediately and after render to ensure it works
            window.scrollTo(0, 0);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 10);
            
        } catch (error) {
            console.error('Error loading snippet:', error);
            this.contentView.innerHTML = '<div class="error">Error loading snippet</div>';
        }
    }
    
    async loadChangesPage() {
        try {
            const response = await fetch('/api/changes');
            if (!response.ok) {
                throw new Error('Failed to load changes');
            }
            
            const data = await response.json();
            this.renderChangesPage(data.changes);
            
            // Update page title
            document.title = 'miso';
            
            // Scroll to top immediately and after render to ensure it works
            window.scrollTo(0, 0);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 10);
            
        } catch (error) {
            console.error('Failed to load changes:', error);
            // Fallback to miso.md
            this.loadSnippet('miso.md', false);
        }
    }
    
    renderChangesPage(changes) {
        const breadcrumbsHtml = `<nav class="breadcrumbs">
            <div class="breadcrumb-trail"><span class="breadcrumb-current">recent changes</span></div>
            <a href="#" class="recent-link root-link">root</a>
        </nav>`;
        
        const changesHtml = changes.map(change => `
            <div class="child-item" onclick="editor.navigateToPath('${change.path}')">
                <div class="child-item-header">
                    <div class="child-item-title">${change.title}</div>
                    <div class="child-item-time">${change.modified_readable}</div>
                </div>
                <div class="child-item-summary">${change.summary}</div>
            </div>
        `).join('');
        
        this.contentView.innerHTML = breadcrumbsHtml + `
            <div class="child-view-inline">
                ${changesHtml}
            </div>
        `;
        
        // Set up root link handler
        const rootLink = this.contentView.querySelector('.root-link');
        if (rootLink) {
            rootLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.loadSnippet('miso.md');
            });
        }
        
        // Clear child view since we're showing changes in content
        this.childView.innerHTML = '';
        
        // Set current path to empty to indicate we're on changes page
        this.currentPath = '';
    }
    
    navigateToPath(path) {
        // Use actual browser navigation for natural scroll-to-top behavior
        const url = URLManager.snippetPathToUrl(path);
        window.location.href = url;
    }
    
    navigateToRecent() {
        window.location.href = '/~recent';
    }
    
    async renderContent(snippet) {
        let html = marked.parse(snippet.content);
        
        // Build and render breadcrumbs
        const segments = this.buildBreadcrumbTrail(this.currentPath);
        const titledSegments = await this.fetchBreadcrumbTitles(segments);
        const breadcrumbsHtml = this.renderBreadcrumbs(titledSegments);
        
        // Extract title and content separately
        const titleMatch = html.match(/<h1>([^<]+)<\/h1>/);
        const title = titleMatch ? titleMatch[1] : 'Untitled';
        const contentWithoutTitle = html.replace(/<h1>([^<]+)<\/h1>/, '');
        
        // Create content header with properly aligned edit button
        const editButton = `<button class="edit-btn inline-edit-btn" onclick="editor.startContentEditing()">Edit</button>`;
        const contentHeader = `
            <div class="content-header">
                <h1>${title}</h1>
                ${editButton}
            </div>`;
        
        // Render children inline within content view
        const childrenHtml = this.currentSnippet.children.map(child => `
            <div class="child-item" onclick="editor.navigateToChild('${child.path}')">
                <div class="child-item-header">
                    <div class="child-item-title">${child.title}</div>
                    <div class="child-item-time">${child.modified_readable}</div>
                </div>
                <div class="child-item-summary">${child.summary}</div>
            </div>
        `).join('');
        
        const childrenTitle = this.currentSnippet.children.length > 0 ? 
            `<h3>children (${this.currentSnippet.children.length}) <button class="add-child-btn" onclick="editor.startChildCreation()">+</button></h3>` : 
            '<h3>no children <button class="add-child-btn" onclick="editor.startChildCreation()">+</button></h3>';
        
        const childrenSection = `<div class="child-view-inline">${childrenTitle}${childrenHtml}</div>`;
        
        this.contentView.innerHTML = breadcrumbsHtml + contentHeader + `<div class="rendered-content">${contentWithoutTitle}</div>` + childrenSection;
        
        // Clear the separate child view
        this.childView.innerHTML = '';
    }
    
    renderChildren(snippet) {
        // This method is no longer used since children are rendered inline
    }
    
    navigateToChild(path) {
        // Use actual browser navigation for natural scroll-to-top behavior
        const url = URLManager.snippetPathToUrl(path);
        window.location.href = url;
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
        
        // Insert at the beginning of inline child view (after the h3 title)
        const childView = document.querySelector('.child-view-inline');
        const titleElement = childView.querySelector('h3');
        titleElement.insertAdjacentElement('afterend', editingChild);
        
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
        
        // Global click handler for canceling (bound to this instance)
        this.globalClickHandler = (e) => {
            if (!e.target.closest('.editing-child') && !e.target.closest('.add-child-btn')) {
                this.cancelChildCreation();
            }
        };
        document.addEventListener('click', this.globalClickHandler);
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
        if (this.globalClickHandler) {
            document.removeEventListener('click', this.globalClickHandler);
            this.globalClickHandler = null;
        }
    }

    startContentEditing() {
        if (this.isEditingContent) return;
        this.isEditingContent = true;
        
        // Store original content for cancellation
        this.originalContent = this.currentSnippet.content;
        
        // Update buttons first - replace inline edit button with save/cancel
        const editButton = document.querySelector('.inline-edit-btn');
        if (editButton) {
            editButton.outerHTML = `
                <div class="edit-button-group">
                    <button class="edit-btn save inline-edit-btn" onclick="editor.saveContentChanges()">Save</button>
                    <button class="edit-btn cancel inline-edit-btn" onclick="editor.cancelContentEditing()">Cancel</button>
                </div>
            `;
        }
        
        // Replace rendered content with WYSIWYG editor
        const renderedContent = document.querySelector('.rendered-content');
        renderedContent.innerHTML = '';
        
        this.wysiwygEditor = new WYSIWYGEditor(renderedContent, this.originalContent);
    }

    async saveContentChanges() {
        const newContent = this.wysiwygEditor ? 
            this.wysiwygEditor.getMarkdown() : 
            document.querySelector('.content-textarea')?.value || '';
        
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
        if (this.wysiwygEditor) {
            this.wysiwygEditor.cleanup();
            this.wysiwygEditor = null;
        }
        this.isEditingContent = false;
        this.originalContent = '';
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
        
        // Add recent link only if we're not on the recent changes page
        const recentLinkHtml = this.currentPath !== '' ? 
            '<a href="#" class="recent-link" onclick="editor.navigateToRecent()">recent</a>' : '';
        
        return `<nav class="breadcrumbs">
            <div class="breadcrumb-trail">${breadcrumbsHtml}</div>
            ${recentLinkHtml}
        </nav>`;
    }
    
    setupBreadcrumbHandlers() {
        // Delegate click handling for breadcrumb links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('breadcrumb-link')) {
                e.preventDefault();
                const path = e.target.dataset.path;
                const url = URLManager.snippetPathToUrl(path);
                window.location.href = url;
            }
        });
    }
    
    navigateUp() {
        // Navigate to parent by removing the last segment
        const pathParts = this.currentPath.split('/');
        if (pathParts.length > 1) {
            // Remove the filename to get parent directory
            pathParts.pop();
            const parentPath = pathParts.join('/') + '.md';
            const url = URLManager.snippetPathToUrl(parentPath);
            window.location.href = url;
        } else {
            // Already at root, stay at root
            window.location.href = '/miso';
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
                
                // Right swipe from left edge - navigate to parent
                if (deltaX > swipeThreshold && touchStartX < edgeThreshold) {
                    this.navigateUp();
                }
            }
        });
        
    }
    
    
    addSwipeHint() {
        // Show a temporary hint for mobile users
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.textContent = 'Swipe from left edge to go back';
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
        }, 4000);
    }
    
}

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
        
        // Handle blank file initialization
        if (content.trim().match(/^# .+\n\*.*\*\s*$/)) {
            // This is a new blank file - add blank line after summary and set cursor position
            const lines = content.trim().split('\n');
            if (lines.length === 2) {
                content = content.trim() + '\n\n';
            }
        }
        
        this.editor.innerHTML = marked.parse(content);
        
        this.container.appendChild(this.editor);
        this.setupEventHandlers();
        
        // Set cursor to end if blank file
        if (content.trim().match(/^# .+\n\*.*\*\s*$/)) {
            this.setCursorToEnd();
        }
    }

    setCursorToEnd() {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(this.editor);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    setupEventHandlers() {
        this.editor.addEventListener('mouseup', () => this.handleSelection());
        this.editor.addEventListener('keyup', (e) => {
            this.handleSelection();
            this.handleKeyboardShortcuts(e);
        });
        this.editor.addEventListener('keydown', (e) => this.handleSpecialKeys(e));
        this.editor.addEventListener('input', () => this.handleAutoFormatting());
        
        // Bind the click outside handler to this instance
        this.clickOutsideHandler = (e) => this.handleClickOutside(e);
        document.addEventListener('mousedown', this.clickOutsideHandler);
    }

    handleKeyboardShortcuts(e) {
        if (e.key === '`' || e.key === '*') {
            // Check if we just typed formatting shortcuts
            setTimeout(() => this.checkFormatShortcuts(), 10);
        }
    }

    handleSpecialKeys(e) {
        if (e.key === 'Enter') {
            setTimeout(() => this.handleEnterKey(), 10);
        }
    }

    checkFormatShortcuts() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        if (textNode.nodeType !== Node.TEXT_NODE) return;
        
        const text = textNode.textContent;
        const cursorPos = range.startOffset;
        
        // Check for `text` (code)
        const codeMatch = text.match(/(.*)(`[^`]*`)(.*)/);
        if (codeMatch && cursorPos > codeMatch[1].length && cursorPos <= codeMatch[1].length + codeMatch[2].length) {
            this.replaceWithFormat(textNode, codeMatch, 'code');
            return;
        }
        
        // Check for **text** (bold)
        const boldMatch = text.match(/(.*?)(\*\*[^*]*\*\*)(.*)/);
        if (boldMatch && cursorPos > boldMatch[1].length && cursorPos <= boldMatch[1].length + boldMatch[2].length) {
            this.replaceWithFormat(textNode, boldMatch, 'bold');
            return;
        }
        
        // Check for *text* (italic)
        const italicMatch = text.match(/(.*?)(\*[^*]*\*)(.*)/);
        if (italicMatch && cursorPos > italicMatch[1].length && cursorPos <= italicMatch[1].length + italicMatch[2].length) {
            this.replaceWithFormat(textNode, italicMatch, 'italic');
            return;
        }
    }

    replaceWithFormat(textNode, match, format) {
        const [fullMatch, before, formatText, after] = match;
        const innerText = formatText.slice(format === 'code' ? 1 : (format === 'bold' ? 2 : 1), 
                                         format === 'code' ? -1 : (format === 'bold' ? -2 : -1));
        
        let formattedElement;
        switch (format) {
            case 'code':
                formattedElement = document.createElement('code');
                break;
            case 'bold':
                formattedElement = document.createElement('strong');
                break;
            case 'italic':
                formattedElement = document.createElement('em');
                break;
        }
        formattedElement.textContent = innerText;
        
        // Replace the text node
        const newNode = document.createDocumentFragment();
        if (before) newNode.appendChild(document.createTextNode(before));
        newNode.appendChild(formattedElement);
        if (after) newNode.appendChild(document.createTextNode(after));
        
        textNode.parentNode.replaceChild(newNode, textNode);
    }

    handleAutoFormatting() {
        // Handle automatic bullet formatting
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const currentElement = range.commonAncestorContainer;
        
        // Check if we're at the start of a line with '- '
        if (currentElement.nodeType === Node.TEXT_NODE) {
            const text = currentElement.textContent;
            if (text.match(/^- /)) {
                this.convertToBullet(currentElement);
            }
        }
    }

    handleEnterKey() {
        // Handle blank line -> normal mode
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const currentElement = range.commonAncestorContainer;
        
        if (currentElement.nodeType === Node.TEXT_NODE && currentElement.textContent.trim() === '') {
            this.convertToNormal(currentElement);
        }
    }

    convertToBullet(textNode) {
        const li = document.createElement('li');
        li.textContent = textNode.textContent.replace(/^- /, '');
        textNode.parentNode.replaceChild(li, textNode);
        
        // Set cursor to end of li
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(li);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    convertToNormal(textNode) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(''));
        textNode.parentNode.replaceChild(p, textNode);
        
        // Set cursor in paragraph
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(p, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
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
        
        if (format === 'normal') {
            // Special handling for normal format - remove all formatting
            this.removeFormatting();
        } else {
            const selectedText = this.currentSelection.toString();
            let formattedText;
            
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
            const fragment = document.createRange().createContextualFragment(formattedText);
            this.currentSelection.insertNode(fragment);
        }
        
        this.hideFormatPopup();
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
    }

    handleClickOutside(e) {
        if (this.popup && !this.popup.contains(e.target) && !this.editor.contains(e.target)) {
            this.hideFormatPopup();
        }
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
        let markdown = html
            // De-escape HTML entities first
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            
            // Convert formatting
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<code>(.*?)<\/code>/g, '`$1`')
            
            // Convert headings with single blank line after
            .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
            .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
            .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
            
            // Convert bullets to newlines (no trailing newline for consecutive bullets)  
            .replace(/<li>(.*?)<\/li>/g, '- $1\n')
            
            // Convert paragraphs with exactly one blank line between
            .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
            .replace(/<br\s*\/?>/g, '\n')
            
            // Strip remaining HTML
            .replace(/<[^>]*>/g, '');
        
        // Clean up spacing - ensure exactly one blank line between paragraphs
        markdown = markdown
            .replace(/\n{3,}/g, '\n\n') // Multiple blank lines -> single blank line
            .replace(/\n\n\n/g, '\n\n') // Triple newlines -> double
            .trim();
        
        // Ensure single blank line after headings
        markdown = markdown
            .replace(/(^|\n)(#{1,6} .+)\n([^\n])/gm, '$1$2\n\n$3');
        
        // Ensure bullet items are on newlines but consecutive bullets stay together
        markdown = markdown
            .replace(/([^\n])(- )/g, '$1\n$2')     // Add newline before bullets
            .replace(/(- .+?)\n\n(- )/gs, '$1\n$2'); // Remove blank lines between consecutive bullets (global, dotall)
        
        return markdown;
    }

    cleanup() {
        if (this.clickOutsideHandler) {
            document.removeEventListener('mousedown', this.clickOutsideHandler);
        }
        this.hideFormatPopup();
    }
}

// Initialize editor when page loads
let editor;
document.addEventListener('DOMContentLoaded', () => {
    editor = new SnippetEditor();
    
    // Set initial history state if none exists
    if (!window.history.state) {
        const snippetPath = URLManager.urlToSnippetPath(window.location.href);
        if (snippetPath === null) {
            // Will be handled by initializeFromURL redirect
            return;
        }
        window.history.replaceState(
            { snippetPath, title: 'miso' }, 
            'miso', 
            window.location.pathname
        );
    }
});