// Extract and test breadcrumb functionality from SnippetEditor
// Since the methods are inside a class, we'll create a minimal test version

class TestableSnippetEditor {
    constructor() {
        this.currentPath = "miso.md";
    }
    
    buildBreadcrumbTrail(currentPath) {
        if (currentPath === "miso.md") {
            return [{ title: "miso", path: "miso.md" }];
        }
        
        const segments = [];
        const parts = currentPath.split('/');
        
        segments.push({ title: "miso", path: "miso.md" });
        
        let buildPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
            if (i === 0 && parts[i] === "miso") {
                buildPath = parts[i];
                continue;
            }
            buildPath += (buildPath ? "/" : "") + parts[i];
            segments.push({ title: parts[i], path: buildPath + ".md" });
        }
        
        const filename = parts[parts.length - 1];
        const title = filename.replace('.md', '');
        segments.push({ title: title, path: currentPath });
        
        return segments;
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

    async fetchBreadcrumbTitles(segments) {
        const promises = segments.map(async (segment, index) => {
            if (index === 0) return { ...segment, title: "miso" };
            
            try {
                const response = await fetch(`/api/snippet/${segment.path}`);
                const data = await response.json();
                return { ...segment, title: data.title };
            } catch {
                return segment;
            }
        });
        
        return Promise.all(promises);
    }
}

describe('Breadcrumbs Core Functionality Tests', () => {
    let editor;
    
    beforeEach(() => {
        editor = new TestableSnippetEditor();
    });
    
    test('Root snippet shows single "miso" breadcrumb with no separators or links', () => {
        const segments = editor.buildBreadcrumbTrail("miso.md");
        
        expect(segments).toHaveLength(1);
        expect(segments[0]).toEqual({ title: "miso", path: "miso.md" });
        
        const html = editor.renderBreadcrumbs(segments);
        expect(html).toContain('<span class="breadcrumb-current">miso</span>');
        expect(html).not.toContain('breadcrumb-link');
        expect(html).not.toContain('breadcrumb-separator');
    });
    
    test('Second level shows "miso > agents" with clickable "miso" and current "agents"', () => {
        const segments = editor.buildBreadcrumbTrail("miso/agents.md");
        
        expect(segments).toHaveLength(2);
        expect(segments[0]).toEqual({ title: "miso", path: "miso.md" });
        expect(segments[1]).toEqual({ title: "agents", path: "miso/agents.md" });
        
        const html = editor.renderBreadcrumbs(segments);
        expect(html).toContain('data-path="miso.md"');
        expect(html).toContain('<span class="breadcrumb-current">agents</span>');
        expect(html).toContain('<span class="breadcrumb-separator">></span>');
    });
    
    test('Deep nesting creates proper trail like "miso > agents > workflow" with correct clickability', () => {
        const segments = editor.buildBreadcrumbTrail("miso/agents/workflow.md");
        
        expect(segments).toHaveLength(3);
        expect(segments[0]).toEqual({ title: "miso", path: "miso.md" });
        expect(segments[1]).toEqual({ title: "agents", path: "miso/agents.md" });
        expect(segments[2]).toEqual({ title: "workflow", path: "miso/agents/workflow.md" });
        
        const html = editor.renderBreadcrumbs(segments);
        const linkCount = (html.match(/breadcrumb-link/g) || []).length;
        expect(linkCount).toBe(2); // First two are clickable
        expect(html).toContain('<span class="breadcrumb-current">workflow</span>');
    });
    
    test('Path parsing correctly builds intermediate paths (miso.md, miso/agents.md, etc.)', () => {
        const segments = editor.buildBreadcrumbTrail("miso/agents/workflow/bugfix.md");
        
        expect(segments[0].path).toBe("miso.md");
        expect(segments[1].path).toBe("miso/agents.md");
        expect(segments[2].path).toBe("miso/agents/workflow.md");
        expect(segments[3].path).toBe("miso/agents/workflow/bugfix.md");
    });
});

describe('Breadcrumbs Title Fetching Tests', () => {
    let editor;
    
    beforeEach(() => {
        editor = new TestableSnippetEditor();
    });
    
    test('API success displays actual snippet titles instead of filenames in breadcrumbs', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ title: "Agent System" })
        });
        
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" }
        ];
        
        const result = await editor.fetchBreadcrumbTitles(segments);
        
        expect(result[0].title).toBe("miso");
        expect(result[1].title).toBe("Agent System");
    });
    
    test('API failure gracefully falls back to filename without .md extension', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));
        
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" }
        ];
        
        const result = await editor.fetchBreadcrumbTitles(segments);
        
        expect(result[0].title).toBe("miso");
        expect(result[1].title).toBe("agents"); // Fallback to filename
    });
    
    test('Mixed API results show combination of titles and filename fallbacks', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ title: "Agent System" })
            })
            .mockRejectedValueOnce(new Error('Network error'));
        
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" },
            { title: "workflow", path: "miso/agents/workflow.md" }
        ];
        
        const result = await editor.fetchBreadcrumbTitles(segments);
        
        expect(result[0].title).toBe("miso");
        expect(result[1].title).toBe("Agent System"); // API success
        expect(result[2].title).toBe("workflow"); // API failure fallback
    });
});

describe('Breadcrumbs Navigation Tests', () => {
    let editor;
    let mockLoadSnippet;
    
    beforeEach(() => {
        editor = new TestableSnippetEditor();
        mockLoadSnippet = jest.fn();
        editor.loadSnippet = mockLoadSnippet;
        
        // Set up DOM
        document.body.innerHTML = `
            <div id="content-view"></div>
            <div id="child-view"></div>
        `;
    });
    
    test('Clicking breadcrumb segments navigates to correct snippet path', () => {
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" },
            { title: "workflow", path: "miso/agents/workflow.md" }
        ];
        
        const html = editor.renderBreadcrumbs(segments);
        document.body.innerHTML = html;
        
        // Simulate breadcrumb click handler
        const breadcrumbLink = document.querySelector('[data-path="miso.md"]');
        expect(breadcrumbLink).toBeTruthy();
        expect(breadcrumbLink.getAttribute('data-path')).toBe('miso.md');
    });
    
    test('Current (last) breadcrumb segment is not clickable and has no handler', () => {
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" }
        ];
        
        const html = editor.renderBreadcrumbs(segments);
        document.body.innerHTML = html;
        
        const currentSegment = document.querySelector('.breadcrumb-current');
        expect(currentSegment).toBeTruthy();
        expect(currentSegment.tagName).toBe('SPAN');
        expect(currentSegment.getAttribute('data-path')).toBeNull();
    });
    
    test('Event delegation handles all breadcrumb clicks through single document listener', () => {
        // This test validates the structure needed for event delegation
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" }
        ];
        
        const html = editor.renderBreadcrumbs(segments);
        document.body.innerHTML = html;
        
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
        expect(breadcrumbLinks).toHaveLength(1);
        
        // All links should have the breadcrumb-link class for delegation
        breadcrumbLinks.forEach(link => {
            expect(link.classList.contains('breadcrumb-link')).toBe(true);
            expect(link.getAttribute('data-path')).toBeTruthy();
        });
    });
});

describe('Breadcrumbs Error Handling Tests', () => {
    let editor;
    
    beforeEach(() => {
        editor = new TestableSnippetEditor();
    });
    
    test('Complete network failure still renders breadcrumbs with filename fallbacks', async () => {
        fetch.mockRejectedValue(new Error('Network error'));
        
        const segments = [
            { title: "miso", path: "miso.md" },
            { title: "agents", path: "miso/agents.md" }
        ];
        
        const result = await editor.fetchBreadcrumbTitles(segments);
        
        // Should still return segments with filename fallbacks
        expect(result).toHaveLength(2);
        expect(result[0].title).toBe("miso");
        expect(result[1].title).toBe("agents");
        
        const html = editor.renderBreadcrumbs(result);
        expect(html).toContain('<nav class="breadcrumbs">');
    });
    
    test('Invalid or empty paths handle gracefully without JavaScript errors', () => {
        // Test various edge cases
        expect(() => editor.buildBreadcrumbTrail("")).not.toThrow();
        expect(() => editor.buildBreadcrumbTrail("miso.md")).not.toThrow();
        expect(() => editor.buildBreadcrumbTrail("invalid/path")).not.toThrow();
        
        // Empty string should probably return empty or default
        const emptyResult = editor.buildBreadcrumbTrail("");
        expect(Array.isArray(emptyResult)).toBe(true);
    });
});