import { getAllProducts } from "./index.js";

const productsStore = [];

const form = document.querySelector("form");

const titleInput = document.querySelector("#product-title");
const priceInput = document.querySelector("#product-price");
const categoryInput = document.querySelector("#product-category");
const tagsInput = document.querySelector("#product-tags");
const imageInput = document.querySelector("#product-image");
const descriptionInput = document.querySelector("#product-description");

const createButton = document.querySelector("#create-btn");
const updateButton = document.querySelector("#update-btn");
const modifyButton = document.querySelector("#modify-btn");
const deleteButton = document.querySelector("#delete-btn");

/**
 * Basically similar to one in index.js but without popover
 */

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
  // get the data-product-id value of the closest parent element of the clicked item which has className ".grid-item"
  const id = e.target.closest(".grid-item").getAttribute("data-product-id");
  form.setAttribute("data-current-product", id);

  const product = productsStore.find((p) => p.id === Number(id));

  titleInput.value = product.title;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  tagsInput.value = product.tags.join(" | ");
  imageInput.value = product.images[0];
  descriptionInput.value = product.description;
};

/**
 * POST request to create Product
 */

const createProduct = async (e) => {
  e.preventDefault();
  const inputs = form.querySelectorAll("input");
  let isInputEmpty = false;
  // loop through all inputs and check if empty
  inputs.forEach((input) => {
    if (!input.value) {
      alert(`${input.name} field is required`);
      isInputEmpty = true;
    }
  });
  if (isInputEmpty) return;
  const data = {
    title: titleInput.value,
    price: priceInput.value,
    category: categoryInput.value,
    tags: tagsInput.value.split("|"), //remove all '|' characters and make and array out of it
    images: [imageInput.value],
    description: descriptionInput.value,
  };
  console.log(data);
  fetch(window.origin + "/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      alert("Product successfully created!");
      location.reload();
    });
};

/**
 * PATCH request for partial modifications
 *
 */
const modifyProduct = async (e) => {
  e.preventDefault();
  const id = form.getAttribute("data-current-product");

  const productData = {};
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value) {
      if (input.name === "images") {
        productData[input.name] = [input.value];
      } else if (input.name === "tags") {
        productData[input.name] = input.value.split("|");
      } else {
        productData[input.name] = input.value;
      }
    }
  });
  console.log(productData);
  fetch(window.origin + "/api/products/" + id, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
};

/**
 * PUT request to update Product completely
 */

const updateProduct = async (e) => {
  e.preventDefault();
  const inputs = form.querySelectorAll("input");
  let isInputEmpty = false;
  inputs.forEach((input) => {
    if (!input.value) {
      alert(`${input.name} field is required`);
      isInputEmpty = true;
    }
  });
  if (isInputEmpty) return;

  const id = form.getAttribute("data-current-product");
  const productData = {
    id: id,
    title: titleInput.value,
    price: priceInput.value,
    category: categoryInput.value,
    tags: tagsInput.value.split("|"),
    images: [imageInput.value],
    description: descriptionInput.value,
  };
  fetch(window.origin + "/api/products/", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((res) => res.json())
    .then((res) => {
      alert("Product successfully updated");
      console.log(res);
      location.reload();
    });
};

/**
 * DELETE request to destroy Product completely from the face of the earth :)
 */
const deleteProduct = () => {
  const id = form.getAttribute("data-current-product");
  fetch(window.origin + "/api/products/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
};

window.onload = () => {
  getAllProducts() // Fetch Products from BE //! Function defined in index.js
    .then((data) => displayProducts(data)) //display all the products
    .then(() => {
      const productCards = document.querySelectorAll(".grid-item");
      productCards.forEach((card) =>
        card.addEventListener("click", fillInputs)
      );
    });
  createButton.addEventListener("click", createProduct);
  updateButton.addEventListener("click", updateProduct);
  modifyButton.addEventListener("click", modifyProduct);
  deleteButton.addEventListener("click", deleteProduct);
};
