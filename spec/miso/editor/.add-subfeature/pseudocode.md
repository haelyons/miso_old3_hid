# pseudocode
*natural language description of add-subfeature implementation*

**HTML Structure Enhancement:**
Modify the children heading to include a plus button alongside the current "children (N)" text. The button should be styled as a small, clickable '+' symbol positioned to the right of the heading.

**JavaScript State Management:**
Add an editing state flag to track when a user is creating a new child. This prevents multiple simultaneous edit operations and manages the temporary child item display.

**Create New Child Function:**
```
function startChildCreation():
    if already editing, return early
    set editing state to true
    create temporary child element with two input fields
    insert temporary child at top of children list
    focus on title input field
```

**Input Field Handling:**
```
function setupEditableChild():
    create title input with placeholder "Enter title..."
    create summary input with placeholder "Enter summary..."
    setup tab navigation between fields
    setup enter key handler for save
    setup escape key handler for cancel
```

**Save New Child Function:**
```
function saveNewChild(title, summary):
    validate both fields are not empty
    generate filename from title (lowercase, hyphenated)
    determine target directory based on current snippet path
    create markdown content with title and summary
    send API request to create new file
    navigate to new snippet on success
    clear editing state
```

**Cancel Creation Function:**
```
function cancelChildCreation():
    remove temporary child element
    clear editing state
    return focus to plus button
```