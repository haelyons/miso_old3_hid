# search
_retrieving product metadata_

We want to accept a product's URL from a supported e-commerce website. The system first checks an internal database for an existing record of the product. If not found, it uses an external API (Diffbot) to retrieve the product's metadata.

This metadata includes:
- product name, seller name, image links, description, category path, price, datetime

The system may also collect seller-specific information like their location and store establishment date to build a seller profile.

All processed products are stored in a database, which acts as a cache to minimize external API calls. The URL parsing logic is handled within the application using predefined patterns for each supported merchant.