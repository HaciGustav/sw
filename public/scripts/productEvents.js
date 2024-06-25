import { productsStore } from "./index.js";

export const addToCart = (e) => {
  let cart = JSON.parse(localStorage.getItem("cart") || `[]`);

  const productID = e.target.getAttribute("data-product-id");

  const existing = cart.find((p) => p.id === productID);
  if (existing) {
    cart = [
      ...cart.filter((p) => p.id !== existing.id),
      { ...existing, quantity: existing.quantity + 1 },
    ];
  } else {
    cart.push({ id: productID, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
};

export const removeFromCart = (e) => {
  const buttonID = e.target.getAttribute("data-button-id");
  const productID = e.target
    .closest(".cart-product")
    .getAttribute("data-product-id");
  console.log(buttonID);
  if (buttonID !== productID) return;

  let cart = JSON.parse(localStorage.getItem("cart") || `[]`);
  const existing = cart.find((p) => p.id === productID);
  console.log(existing);
  if (existing.quantity > 1) {
    cart = [
      ...cart.filter((p) => p.id !== existing.id),
      { ...existing, quantity: existing.quantity - 1 },
    ];
  } else {
    cart = cart.filter((p) => p.id !== productID);

    console.log(cart);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
  displayCartContent();
};

//CART POPOVER
/**
 * retrieve all products from localStorage with localStorage.getItem("cart")
 * cart.forEach(p=> {
 * const product =  productStore.find(item=> item.id === p.id)
 * if product then abbilden (product.price, product.title,product.images[0])
 * else geh weiter
 * })
 */

export const displayCartContent = () => {
  const cartContainer = document.querySelector(".cart-content");
  const cartContent = JSON.parse(localStorage.getItem("cart"));

  //if there is an element other then checkout button then remove all
  if (cartContainer.childElementCount > 1) {
    const children = cartContainer.querySelectorAll(".cart-product");
    children.forEach((child) => child.remove());
  }

  cartContent.forEach((item) => {
    const product = productsStore.find((product) => product.id == item.id);

    // This method is callesd object destructuring
    // you can extract the fields of an object to use
    // same as product.price notation
    const { price, title, images, price_BTC, id } = product;

    const productCard = document.createElement("div");

    productCard.className = "cart-product";

    // data-product-id attribute is used to determine which remove button responsible
    // of which product. if data-product-id and data-button-id match product will be
    // removed after calling removeFromCart event
    productCard.setAttribute("data-product-id", id);

    productCard.innerHTML = `
    <span class="remove-product" data-button-id=${id} >-</span>
    <img src="${images[0]}" alt="${title}">
    <div class="product-detail">
    <p class="product-title">${title}</p>
    <p class="product-price">
    Price: <span class="usd-price">$${price}</span> <br/>
    <span class="btc-price">${price_BTC} BTC</span>
    </div>
    </p>
    `;
    const removeBtn = productCard.querySelector(".remove-product");
    removeBtn.addEventListener("click", removeFromCart);
    // .prepend() method adds the html element to the beginning not to the end of container
    cartContainer.prepend(productCard);
  });
};

export const checkoutProducts = (user) => {
  let productIDs = JSON.parse(localStorage.getItem("cart"));
  //Convert all product ids into Number
  productIDs = productIDs.map((item) => Number(item.id));
  const cart_popover = document.querySelector("#cart-container");

  fetch("/api/products/checkout", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      user,
      productIDs,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      alert("Checkout has been proceed");
      localStorage.removeItem("cart");
      cart_popover.hidePopover();
    });
};
