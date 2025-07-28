# testing
*validating WYSIWYG editor functionality through systematic test cases*

**Text Selection Tests:**
- Text selection within a single paragraph highlights correctly
- Full paragraph selection highlights the entire paragraph block
- Selection spans across multiple paragraphs handle boundaries properly
- Double-click selects whole words, triple-click selects paragraphs
- Selection state persists when format popup menu appears

**Popup Menu Tests:**
- Format popup appears immediately after text selection
- Popup positions itself near the selected text without obscuring content
- Popup contains all format options: title, bullet, italic, bold, code
- Popup disappears when clicking outside selected area
- Popup remains visible while hovering over format options

**Format Application Tests:**
- Normal format removes all HTML formatting from selected content and returns plain text
- Bold format wraps selected text with **bold** markdown syntax
- Italic format wraps selected text with *italic* markdown syntax
- Code format wraps selected text with `code` markdown syntax
- Title format converts paragraph to # Title markdown syntax
- Bullet format converts paragraph to - bullet markdown syntax

**Format Removal Tests:**
- Normal format correctly removes bold formatting from `<strong>text</strong>` selections
- Normal format correctly removes italic formatting from `<em>text</em>` selections  
- Normal format correctly removes code formatting from `<code>text</code>` selections
- Normal format handles complex nested formatting and extracts clean plain text
- Normal format clears selection after removing formatting for clean user feedback

**Content Rendering Tests:**
- Applied formats render immediately in WYSIWYG view
- Multiple formats can be applied to different text sections
- Format changes update the underlying markdown source correctly
- WYSIWYG display matches final rendered markdown output
- Undo/redo functionality preserves format changes

**Integration Tests:**
- WYSIWYG mode integrates with existing Save/Cancel button functionality
- Switching between WYSIWYG and raw markdown preserves content integrity
- Format popup works correctly within the existing edit textarea container
- WYSIWYG editor maintains compatibility with content-editing workflow