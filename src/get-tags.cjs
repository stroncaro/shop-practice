var fs = require('node:fs');


const url = `https://dummyjson.com/products?limit=0&select=tags`;

fetch(url)
  .then( (response) => response.json())
  .then( (json) => {    
    const tagsAggregated = json.products.reduce(
      (prev, product) => [...prev, ...product.tags],
      []
    );

    const tags = Array
      .from(new Set(tagsAggregated))
      .sort((a, b) => (a > b) - (a < b));

    const obj = {
      tags: tags,
    }

    const tagJson = JSON.stringify(obj);

    fs.writeFile('product-tags.json', tagJson, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('Success!');
      }
    });
  })
  .catch((error)    => { console.error(error) });