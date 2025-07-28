# changes

*special page that shows recently updated features*

When we request the `/~recent` URL (eg. localhost:5000/~recent), we should see a list of recently updated feature snippets. Each item should be in child-view format (i.e. title/summary both on one line), with the date of edit visible. Clicking on the item should go to the feature snippet URL.

The changes list should only include actual feature specification files, not implementation files from metafolders (directories starting with dots like `.breadcrumbs/`, `.changes/`, etc). This keeps the page focused on user-visible features rather than development artifacts.

The root URL (/) should redirect to `/miso` to show the main miso.md specification by default.

To provide easy access to the changes page, a "recent" button should appear on the right side of the breadcrumbs bar on all snippet pages (but not on the changes page itself). This button should be styled to match the edit button appearance and navigate to `/~recent` when clicked.