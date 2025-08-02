# views
_observability at every step_

A minimal web interface that starts with only essential elements and builds vertically as users progress through the analysis. The core principle is exploratory simplicity - users discover functionality through interaction rather than overwhelming initial presentation.

## initial state
The landing page shows four elements: the Human Mode logo, tagline "Helping small artisans stand out", a search bar with placeholder "Product URL", and supported store icons below.

## progressive interaction
After URL submission, the interface grows vertically. The search bar remains at the top. Analysis cards appear sequentially below - first the product extraction card, then segmentation, then AI detection. Each completed card spawns a "Next" button that reveals the subsequent analysis stage.

## visual continuity  
Cards maintain state through color: neutral while processing, green on success, red on failure. Failed steps disable subsequent "Next" buttons (greyed out) but show error details within the card for transparency. The interface preserves all previous steps for full traceability of the analysis journey.