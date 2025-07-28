# single-column
*vertical layout with content above children*

The editor should use a single-column layout instead of the current two-column side-by-side design. The content view displays the snippet's markdown content at the top with a subtle separator below the summary line, and the children view appears directly below it when scrolling down.

This creates a more natural reading flow where users can read the full content first, then see the available child snippets without needing to look to the side. The layout eliminates the splitter and resize functionality since everything flows vertically.

For mobile devices, the existing swipe gestures are preserved for navigation, but the child view remains positioned below the content rather than sliding in from the side.

The single-column approach provides better readability on both desktop and mobile by allowing full width for content display and natural scrolling behavior.