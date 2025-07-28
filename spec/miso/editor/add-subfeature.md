# add-subfeature
*enabling users to create new child snippets directly in the editor*

The add-subfeature feature allows users to create new child specifications through an inline editing interface, supporting the core miso workflow of building the specification tree interactively.

**Add Button Interface:**
A '+' button appears to the right of the "children (N)" heading in the child view. When clicked, it creates a new editable child item at the top of the children list.

**Inline Editing:**
The new child displays as editable input fields for both title and summary. Users can tab between fields or click to focus on either field, with clear visual indication of the active field.

**Content Creation:**
Once both title and summary are filled, users can confirm creation (via Enter key or save action). The system generates a new .md file with the title as filename and creates basic markdown content using the title and summary.

**File System Integration:**
New files are created in the appropriate directory based on the current snippet's location. The filename follows miso conventions (lowercase, hyphenated) derived from the user's title input.

**Navigation Flow:**
After successful creation, the editor automatically navigates to the new snippet in editor mode, allowing immediate further editing or specification development.

**Cancellation:**
Users can cancel creation by pressing Escape or clicking outside the edit area, which removes the temporary child item without creating any files.