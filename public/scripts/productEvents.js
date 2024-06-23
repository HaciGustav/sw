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
