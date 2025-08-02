# mask
_product segmentation_

After a product is successfully retrieved, the user can initiate an analysis to check for AI-generated content. The first step in this analysis is "masking," where the system isolates the product from its background in the provided images.

This is achieved by sending the product image URLs to an external segmentation API. The API returns masks of the detected products, which are then passed to the "detect" stage. The system should provide visual feedback to the user during this process and clearly indicate any failures in communicating with the segmentation API.