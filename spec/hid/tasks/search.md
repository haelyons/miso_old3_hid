# search
_retrieving product metadata_

We want to accept a products URL from an e-commerce website, and parse it to return metadata, specifically:
- product name, seller name, image links, description, category path, price, datetime

We may want to collect information more targeted at the seller to create a profile for them as well. This could include the current rating (though we don't need to store that), their location, and the date the store was established.

We want to keep a record of the products that we've processed, for which we will use a database.

The database will also be used to parse our input URLs by providing matched patterns.