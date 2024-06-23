//! NOTE FROM MEHMET:
//! PART-1
//!  after login and register you get user credentials in cookies
//* 'user=j:{"id":8,"firstname":"gustave","lastname":"lebon","email":"gustave@lebon.com","cart":[]}'
//!  if you want to display or use them implement the following code (or use it as an inspiration)
//!  JSON.parse(decodeURIComponent(document.cookie).substring(7))
//!  if there is credentials in cookies the result should look like this:
//*  {
//* "id": 8,
//* "firstname": "gustave",
//* "lastname": "lebon",
//* "email": "gustave@lebon.com",
//* "cart": []
//* }
//!
//! END

import { addToCart } from "./productEvents.js";

const productsStore = [];
let isLoading = false;

const scrollers = document.querySelectorAll(".h-scroll-container");

if (!window.matchMedia("(prefers-reduces-motion: reduced)").matches) {
  initAnimations();
}

const createAvatar = async (name) => {
  const img = document.createElement("img");
  const url = `https://robohash.org/${name}?size=200x200`;
  await fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      img.src = URL.createObjectURL(blob);
    })
    .catch((err) => {
      console.log(err);
      img.src = "https://robohash.org/default";
    });
  document.querySelector("nav ul").appendChild(img);
};

const getUserCred = () => {
  const cookies = decodeURIComponent(document.cookie);

  if (!cookies) {
    return;
  }

  const user = JSON.parse(cookies.substring(7));
  return user;
};

function initAnimations() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);
    const scroller_inner = scroller.querySelector(".h-scroll-wrapper");
    const scroller_content = Array.from(scroller_inner.children);
    scroller_content.forEach((elmnt) => {
      const duplicate = elmnt.cloneNode(true);
      duplicate.setAttribute("aria-hidden", true);
      scroller_inner.appendChild(duplicate);
    });
  });
}

function filter(elmnt, category) {
  Array.from(elmnt.parentElement.querySelectorAll("li")).forEach((filter) => {
    filter.classList.remove("active");
  });
  elmnt.classList.add("active");
  Array.from(
    elmnt.parentElement.parentElement.querySelector(".filter-container-items")
      .children
  ).forEach((item) => {
    if (category !== "all" && !Array.from(item.classList).includes(category)) {
      item.classList.add("hidden");
    } else {
      item.classList.remove("hidden");
    }
  });
}
async function addCredits(userId, credits) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/users/add-credits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, credits }),
      }
    );
    const data = await response.json();
    console.log(data); // Handle response as needed
    // Optionally update UI or show a message indicating success/failure
  } catch (error) {
    console.error("Error adding credits:", error);
    // Handle error scenario, show error message to user, etc.
  }
}

// Function to purchase product with credits
async function purchaseProduct(userId, productId) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/users/purchase-product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      }
    );
    const data = await response.json();
    console.log(data); // Handle response as needed
    // Optionally update UI or show a message indicating success/failure
  } catch (error) {
    console.error("Error purchasing product:", error);
    // Handle error scenario, show error message to user, etc.
  }
}

// FORMS

const validate_login = () => {
  if (
    document.forms["login-form"]["email"].value === "" ||
    document.forms["login-form"]["password"].value === ""
  ) {
    alert("Please fill in all fields");
    return false;
  }
};

const validate_register = () => {
  if (
    document.forms["register-form"]["email"].value === "" ||
    document.forms["register-form"]["password"].value === "" ||
    document.forms["register-form"]["firstname"].value === "" ||
    document.forms["register-form"]["lastname"].value === "" ||
    document.forms["register-form"]["address"].value === ""
  ) {
    alert("Please fill in all fields");
    return false;
  }
  if (
    document.forms["register-form"]["password"].value !=
    document.forms["register-form"]["password2"].value
  ) {
    alert("The passwords do not match!");
    return false;
  }
};

const login = async () => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.forms["login-form"]["email"].value,
        password: document.forms["login-form"]["password"].value,
      }),
    }).then((response) => {
      // console.log(response);
      if (!response.ok) {
        alert("The login attempt has failed!");
      } else {
        return response.json();
      }
    });

    createAvatar(res.firstname);
  } catch (error) {
    console.error(error);
  }

  /*   const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.forms["login-form"]["email"].value,
      password: document.forms["login-form"]["password"].value,
    }),
  })
    .then((response) => {
      // console.log(response);
      if (!response.ok) {
        alert("The login attempt has failed!");
      } else {
        return response.json();
      }
    })
    .catch((error) => {
      console.error(error);
      alert("There has been an error!");
    });
 */
};

const register = () => {
  fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.forms["register-form"]["email"].value,
      password: document.forms["register-form"]["password"].value,
      firstname: document.forms["register-form"]["firstname"].value,
      lastname: document.forms["register-form"]["lastname"].value,
      address: document.forms["register-form"]["address"].value,
    }),
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        alert("The signup attempt has failed!");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("There has been an error!");
    });
};

export const getAllProducts = async () => {
  const data = await fetch("/api/products").then((resp) => {
    if (!resp.ok) {
      alert("There has been an error!");
    }
    return resp.json();
  });
  return data;
};

const displayProducts = (products) => {
  const grid = document.querySelector("#grid .grid-container");
  const scroll = document.querySelector("#scroll .h-scroll-wrapper");
  products.forEach((product, index) => {
    productsStore.push(product);
    grid.innerHTML += `
            <button popovertarget="product_${index}" data-product-id= ${
      product.id
    }>
                <div class="grid-item grid-item-xl">
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
            </button>
            `;
    scroll.innerHTML += `
                <li class="grid-item grid-item-m">
                    <img src="${product.images[0]}" alt="${product.title}">
                    <div class="overlay">${product.title}</div>
                </li>`;
  });
};

window.onload = () => {
  isLoading = true;
  // fetch("/api/products")
  //   .then((resp) => {
  //     if (!resp.ok) {
  //       alert("There has been an error!");
  //     }
  //     return resp.json();
  //   })
  //   .then((products) => {
  //     products.forEach((product, index) => {
  //       productsStore.push(product);
  //       grid.innerHTML += `
  //               <button popovertarget="product_${index}" data-product-id= ${
  //         product.id
  //       }>
  //                   <div class="grid-item grid-item-xl">
  //                       <img src="${product.images[0]}" alt="${product.title}">
  //                       <div class="overlay">${product.title}</div>
  //                   </div>
  //                   <div id="product_${index}" class="product_popover" popover>
  //                   <span class="close-popover" >X</span>
  //                    <img src=${
  //                      product.images[0]
  //                    } alt="Product Image" class="product-img" />
  //                   <div class="product-details">
  //                     <div class="product-tags">
  //                     ${product.tags
  //                       .map((tag) => `<span class="tag">${tag}</span>`)
  //                       .join("")}
  //                     </div>
  //                     <h2 class="product-title">Product Title</h2>
  //                     <p class="product-price">
  //                       Price: <span class="usd-price">$${
  //                         product.price
  //                       }</span> |
  //                       <span class="btc-price">${product.price_BTC} BTC</span>
  //                     </p>
  //                     <p class="product-description">
  //                     ${product.description}
  //                     </p>
  //                      <span class="add-to-cart" data-product-id=${
  //                        product.id
  //                      }>Add to Cart</span>
  //                   </div>
  //                   </div>
  //               </button>
  //               `;
  //       scroll.innerHTML += `
  //                   <li class="grid-item grid-item-m">
  //                       <img src="${product.images[0]}" alt="${product.title}">
  //                       <div class="overlay">${product.title}</div>
  //                   </li>`;
  //     });
  //   })
  //   .then(() => {
  //     const addToCartButtons = document.querySelectorAll(".add-to-cart");
  //     console.log(addToCartButtons);
  //     addToCartButtons.forEach((btn) => {
  //       btn.addEventListener("click", addToCart);
  //     });
  //   });

  getAllProducts()
    .then((data) => displayProducts(data))
    .then(() => {
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      console.log(addToCartButtons);
      addToCartButtons.forEach((btn) => {
        btn.addEventListener("click", addToCart);
      });
    });

  const user = getUserCred();
  createAvatar(user?.firstname);
};
