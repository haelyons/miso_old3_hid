# pseudocode for horizontal children layout

**HTML Structure Changes:**
```
Keep existing child-item container
Change child-item-title and child-item-summary to display inline
Use flexbox to arrange title and summary horizontally
Title on left, summary on right within same line
```

**CSS Layout Updates:**
```
Update child-item to use flexbox with horizontal direction
Set child-item-title to not break to new line
Set child-item-summary to flow to the right of title
Add spacing between title and summary elements
Ensure summary can wrap if needed but stays on same baseline
```

**Responsive Considerations:**
```
On narrow screens, allow summary to wrap within the line
Prevent title from wrapping to maintain structure
Add ellipsis or text truncation if summary becomes too long
Maintain click target across entire child item area
```

**Visual Styling:**
```
Keep existing title styling (blue, bold, clickable)
Keep existing summary styling (gray, italic)
Add appropriate margin/padding between title and summary
Ensure both elements align properly on the same horizontal line
```