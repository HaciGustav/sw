import { getAllProducts } from "./index.js";

let isLoading = false;
const productsStore = [];
const displayProducts = (products) => {
  const grid = document.querySelector(".grid-container");
  products.forEach((product, index) => {
    productsStore.push(product);
    grid.innerHTML += `
            
                  <div  class="grid-item grid-item-xl" data-product-id=${
                    product.id
                  }>
                      <img src="${product.images[0]}" alt="${product.title}">
                      <div class="overlay">${product.title}</div>
                  </div>
                  <div id="product_${index}" class="product_popover" popover>
                  <span class="close-popover" >X</span>
                   <img src=${
                     product.images[0]
                   } alt="Product Image" class="product-img" />
                  <div class="product-details">
                    <div class="product-tags">
                    ${product.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                    </div>
                    <h2 class="product-title">Product Title</h2>
                    <p class="product-price">
                      Price: <span class="usd-price">$${product.price}</span> |
                      <span class="btc-price">${product.price_BTC} BTC</span>
                    </p>
                    <p class="product-description">
                    ${product.description}
                    </p>
                     <span class="add-to-cart" data-product-id=${
                       product.id
                     }>Add to Cart</span>
                  </div>
                  </div>
          
              `;
  });
};

const fillInputs = (e) => {
  const id = e.target.closest(".grid-item").getAttribute("data-product-id");
  console.log(id);
};

window.onload = () => {
  isLoading = true;

  getAllProducts()
    .then((data) => displayProducts(data))
    .then(() => {
      const productCards = document.querySelectorAll(".grid-item");
      productCards.forEach((card) =>
        card.addEventListener("click", fillInputs)
      );
    });
};
