# testing
*validating breadcrumb-url synchronization through systematic test cases*

**URL-to-Content Mapping Tests:**
- Root URL `http://localhost:5000/` automatically redirects to `http://localhost:5000/miso`
- URL `http://localhost:5000/miso` loads miso.md and shows "miso" breadcrumb
- URL `http://localhost:5000/miso/editor` loads miso/editor.md and shows "miso > editor" breadcrumbs
- URL `http://localhost:5000/miso/editor/breadcrumbs` loads miso/editor/breadcrumbs.md with full breadcrumb trail
- Deep URLs load correct content and display proper breadcrumb hierarchy

**Navigation Synchronization Tests:**
- Clicking breadcrumb links updates the URL to match the selected path
- Using browser back button navigates to previous snippet and updates breadcrumbs
- Using browser forward button navigates to next snippet and updates breadcrumbs
- Direct URL navigation works without page refresh (SPA behavior)
- Manual URL editing in address bar loads correct content

**URL Format Tests:**
- URLs use clean paths without .md extensions (e.g., /miso/editor not /miso/editor.md)
- Root path redirects properly to miso content
- Invalid URLs show appropriate error handling
- URLs with trailing slashes are handled consistently
- Special characters in snippet names are URL-encoded properly

**Browser Integration Tests:**
- Page title updates to reflect current snippet title
- Browser history maintains navigation state correctly
- Refresh on any URL loads the correct content
- Bookmarking URLs works and loads correct content when reopened
- Sharing URLs provides direct access to specific snippets

**Error Handling Tests:**
- Non-existent URLs show proper error messages
- Malformed URLs are handled gracefully
- Network issues during navigation provide user feedback