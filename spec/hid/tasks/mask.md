# mask 
_product segmentation_

We will receive product packshot URLs from the search step, and need to extract the products from these images. We have an endpoint that this system will call in order to accomplish that, where it provides product metadata acquired in the previous step.

We want the resulting masks to be displayed to the user, and to report activity. It should flag if the endpoint connection is failing.