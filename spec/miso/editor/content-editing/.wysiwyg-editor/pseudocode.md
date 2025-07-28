# pseudocode
*natural language description of WYSIWYG editor implementation*

**Content Container Enhancement:**
Replace the plain textarea with a contenteditable div that can render HTML while remaining editable. This allows real-time WYSIWYG display while maintaining editing capabilities.

**Selection Detection System:**
```
function setupSelectionHandlers():
    listen for text selection events on contenteditable area
    when selection changes:
        if selection exists and is not empty:
            show format popup near selection
            store current selection for format application
        else:
            hide format popup
```

**Format Popup Creation:**
```
function createFormatPopup():
    create popup div with format options: title, bullet, italic, bold, code
    position popup near current text selection
    style popup with clean, accessible button design
    attach click handlers to each format option
```

**Format Application Logic:**
```
function applyFormat(formatType, selectedText):
    if formatType is "normal":
        call removeFormatting() to strip all HTML tags
    else:
        switch formatType:
            case "bold": wrap selectedText with **bold** syntax
            case "italic": wrap selectedText with *italic* syntax  
            case "code": wrap selectedText with `code` syntax
            case "title": convert line to # Title format
            case "bullet": convert line to - bullet format
        
        replace selected text with formatted version
        update contenteditable display
    
    hide format popup
```

**Format Removal Logic:**
```
function removeFormatting():
    extract selected content including all HTML tags
    create temporary container element
    append selected content to container
    extract plain text content from container (strips all HTML)
    replace selection with clean text node
    clear user selection for clean feedback
```

**Content Synchronization:**
```
function syncContent():
    extract plain markdown from contenteditable HTML
    maintain bidirectional sync between WYSIWYG view and raw markdown
    ensure format changes update underlying content source
```

**Integration with Edit Mode:**  
```
function enableWYSIWYG():
    replace textarea with contenteditable div
    render existing markdown as HTML for editing
    setup selection and format handlers
    maintain Save/Cancel button functionality
```