# cards
_sequential feature visualization_

Each analysis card represents one stage of the h.id pipeline: product extraction (search), image segmentation (mask), and AI detection (detect). Cards appear only after their preceding stage completes successfully.

Cards display the feature name, current status, and results. Processing cards show a loading state with feature description. Completed cards show extracted data or analysis results. Failed cards display error messages and context about what went wrong.

Each successful card generates a "Next" button positioned below the card. The button is uniform in size and style across all stages. Users manually trigger each subsequent analysis step, maintaining control over the process flow. The text of the button itself reflects the action being performed. For example from search -> image masks, we need to "extract". From masks -> AI detection we need to "detect".


Card backgrounds reflect current status: neutral for processing, green for success, red for failure. This provides immediate visual feedback about each stage's outcome. All cards remain visible throughout the session for complete analysis transparency.