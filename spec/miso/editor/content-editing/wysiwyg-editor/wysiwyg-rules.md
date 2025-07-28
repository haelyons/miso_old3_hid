# wysiwyg-rules

*refinements to the editing experience*

- on entering edit mode, the blank file should have a new blank line after the one-line summary, and the editing format should be set to 'normal'
here's some new text.
- here's a new > than the last
- typing the shortcut keys backtick, asterix or double-asterix should switch the mode into (or out of) code, emphasized or bold.
- typing bullet item ('-' at the start of a line) should automatically go into bullet point mode
- typing any blank line should automatically go back to normal mode.
- text content should be de-escaped when turning it into markdown (so no '&gt' type stuff in the markdown)
- markdown paragraphs should always have exactly one blank line between them
- there should always be a single blank line after a heading
- bullet items should always be on newlines