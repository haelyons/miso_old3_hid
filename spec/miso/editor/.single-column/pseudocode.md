# pseudocode for single-column layout

**HTML Structure Changes:**
```
Remove the splitter element between content and child views
Stack content-view and child-view vertically in editor-container
Keep existing breadcrumbs, content rendering, and child item structure
```

**CSS Layout Updates:**
```
Change editor-container from flex row to flex column
Remove splitter styles and hover effects  
Update content-view to use full width with bottom margin
Update child-view to use full width below content
Remove resize-related cursor styles
```

**JavaScript Behavior:**
```
Remove setupResizeHandlers method and all resize event listeners
Remove splitter-related variables and mouse handling
Keep all navigation, breadcrumb, and mobile swipe functionality
Update mobile overlay behavior to not interfere with vertical layout
```

**Mobile Adaptations:**
```
Simplify mobile CSS since layout is naturally vertical
Keep swipe navigation for parent traversal
Remove slide-in child view overlay since children are always visible below
Update swipe hint text to reflect vertical layout
```