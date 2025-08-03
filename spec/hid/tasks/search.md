# search
_product metadata extraction_

Extract product information from e-commerce URLs through URL parsing, database lookup, and external API integration. The system accepts URLs from supported platforms (Etsy, RedBubble, Alibaba) and returns structured product data.

Process: Parse URL to identify merchant and product ID, check internal database for cached data, fallback to Diffbot API for new products. All results stored locally for future requests.

Output format: seller name, product title, images, price, description. Data normalized across different platforms for consistent presentation in product cards.