# testing single-column layout

**Layout Structure:**
- Content view appears at the top of the single column
- Children view appears directly below content view  
- No splitter element exists between sections
- Page scrolls naturally from content to children

**Visual Behavior:**
- Content view uses full width of container
- Children view uses full width below content
- No resize handles or column controls visible
- Scrolling reveals children section after content

**Mobile Compatibility:**
- Left edge swipe still navigates to parent
- Children remain visible below content (no slide-in overlay)
- Content and children stack vertically on mobile

**Responsive Design:**
- Layout works consistently across desktop and mobile
- No horizontal scrolling required
- Children section accessible via vertical scroll only