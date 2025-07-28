# wysiwyg-rules
*refinements to the editing experience*

- Edit mode uses in-place editing where title, summary, and main content become individually editable
- Title editing occurs directly in the h1 element while maintaining original styling
- Summary editing occurs directly in the em element while preserving italics
- Main content editing uses contentEditable div with rich formatting capabilities
- No visual outlines or borders around editable areas for seamless editing experience
- Rich text formatting (bold, italic, headers, lists) is preserved during editing
- HTML-to-markdown conversion processes DOM nodes recursively for accurate translation
- Paragraph spacing uses single blank lines (not double) in generated markdown
- All HTML tags and attributes are properly converted to clean markdown syntax
- Formatting changes made during editing are correctly reflected in saved markdown files
- Visual separator appears only below summary line, not inline italics within content