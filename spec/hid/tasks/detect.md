# detect
_evaluate carbon_

Following the "mask" stage, the "detect" stage evaluates the segmented product images for signs of AI generation. The masks are sent to a specialized API that returns a score indicating the likelihood that the image was created using AI tools.

The results should be presented to the user in a clear, understandable way. While the primary output is a simple "likely" or "unlikely" determination, the system may also receive and display more detailed information, such as the specific AI tools that were potentially used and the confidence level of the prediction. This provides a transparent and informative analysis for the user.