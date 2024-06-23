import { getAllProducts } from "./index.js";

let isLoading = false;
const productsStore = [];

const titleInput = document.querySelector("#product-title");
const priceInput = document.querySelector("#product-price");
const categoryInput = document.querySelector("#product-category");
const descriptionInput = document.querySelector("#product-description");
const updateButton = document.querySelector("#update-btn");
const deleteButton = document.querySelector("#delete-btn");

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

//If Users clicks on a product, the form inputs are filled with choosen product infos
const fillInputs = (e) => {
  const id = e.target.closest(".grid-item").getAttribute("data-product-id");

  const product = productsStore.find((p) => p.id === Number(id));

  titleInput.value = product.title;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  descriptionInput.value = product.description;
};

window.onload = () => {
  isLoading = true;

  getAllProducts() // Fetch Products from BE //! Function defined in index.js
    .then((data) => displayProducts(data))
    .then(() => {
      const productCards = document.querySelectorAll(".grid-item");
      productCards.forEach((card) =>
        card.addEventListener("click", fillInputs)
      );
    });
};
