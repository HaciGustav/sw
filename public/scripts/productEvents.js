export const addToCart = (e) => {
  console.log(e);
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

//CART POPOVER
/**
 * retrieve all products from localStorage with localStorage.getItem("cart")
 * cart.forEach(p=> {
 * const product =  productStore.find(item=> item.id === p.id)
 * if product then abbilden (product.price, product.title,product.images[0])
 * else geh weiter
 * })
 */

export const displayCartContent = async (productStore) => {
  const cartContainer = document.getElementById("cart-container");

  const cartContent = JSON.parse(localStorage.getItem("cart"));
  console.log(cartContent);
  cartContent.forEach((item) => {
    const product = productStore.find((product) => product.id == item.id);
    console.log(product);
    const { price, title, images, price_BTC } = product;
    const productCard = document.createElement("div");
    productCard.className = "cart-product";
    productCard.innerHTML = `
                    <img src="${images[0]}" alt="${title}">
                    <p class="product-title">${title}</p>
                     <p class="product-price">
                    Price: <span class="usd-price">$${price}</span> |
                    <span class="btc-price">${price_BTC} BTC</span>
                  </p>
    `;

    cartContainer.appendChild(productCard);
  });
};
