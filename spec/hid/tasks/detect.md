# detect
_evaluate carbon_

We will receive segmented product masks from the mask stage. We will use these masks in conjunction with an API to receive scoring on the likelihood of the images being generated using AI tooling. 

We may receive more detailed information regarding exactly which tools have been used. We should receive some indication of whether it is more or less likely the product is AI. 

The returned confidence of the prediction should be made clear to the user, though less clear than the overall result. Leeway needs to exist for there to be more or less detail in the provided result.