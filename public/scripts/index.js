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

import {
  addToCart,
  checkoutProducts,
  displayCartContent,
} from "./productEvents.js";

// All products are stored in this array not to make get requests each time
export const productsStore = [];

const scrollers = document.querySelectorAll(".h-scroll-container");
const login_popover = document.querySelector("#login");
const register_popover = document.querySelector("#register");
const loginButton = document.querySelector("#login-btn");
const logoutButton = document.querySelector("#logout-btn");
const userImg = document.querySelector("#user_img");

const checkoutBtn = document.querySelector(".checkout-button");

if (!window.matchMedia("(prefers-reduces-motion: reduced)").matches) {
  initAnimations();
}

/**
 * Makes a get request to create avatar according to users firstname
 * response type is a png file therefore we are creating a blob out of it
 * and a temporary url to use in HTML img tag
 * for detailed info about blob object :
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob
 *  */

const createAvatar = (name) => {
  if (!name) {
    userImg.style.display = "none";
    return;
  }
  userImg.style.display = "block";
  const url = `https://robohash.org/${name}?size=200x200`;
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      userImg.src = URL.createObjectURL(blob);
    })
    .catch((err) => {
      console.log(err);
      userImg.src = "https://robohash.org/default";
    });
};

/**
 * it retrieves the user object from cookies and
 * decodes and parses it to JS Object with JSON.parse
 */

const getUserCred = () => {
  const cookies = decodeURIComponent(document.cookie);
  if (!cookies) {
    return null;
  }
  // const userCookie = cookies.split("; ").find((row) => row.startsWith("user="));
  // if (!userCookie) {
  //   return null;
  // }
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
      "/api/users/add-credits",
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
      "/api/users/purchase-product",
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

function validate_login(e) {
  e.preventDefault();
  if (
    document.forms["login-form"]["email"].value === "" ||
    document.forms["login-form"]["password"].value === ""
  ) {
    alert("Please fill in all fields");
    return false;
  }
  login();
}

const validate_register = (e) => {
  e.preventDefault();
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
  register();
};

const login = (e) => {
  e.preventDefault();

  fetch("/api/auth/login", {
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
      console.log(response);
      if (!response.ok) {
        alert("The login attempt has failed!");
      } else {
        response.json().then((userData) => {
          login_popover.hidePopover();
          createAvatar(userData.firstname);
          loginButton.style.display = "none";
          logoutButton.style.display = "block";
          displayUserInfo(userData); // Display user info including city and country
        });
      }
    })
    .catch((error) => console.error(error));
};

const register = (e) => {
  e.preventDefault();
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
      if (response.ok) {
        register_popover.hidePopover();
        document.forms["login-form"]["email"].value =
          document.forms["register-form"]["email"].value;
        document.forms["login-form"]["password"].value =
          document.forms["register-form"]["password"].value;
        login(e);
      } else {
        alert("The signup attempt has failed!");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("There has been an error!");
    });
};

const logout = (e) => {
  fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      loginButton.style.display = "block";
      logoutButton.style.display = "none";
      userImg.style.display = "none";
    }
  });
};

/**
 * Retrieve user information from cookies and check if user is Admin
 */

const navigateToAdminPage = () => {
  const user = getUserCred();
  console.log(user);
  if (user.isAdmin) window.location.href = "/admin.html";
  else return;
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
            <button popovertarget="product_${index}" data-product-id= ${product.id}>
                <div class="grid-item grid-item-xl">
                    <img src="${product.images[0]}" alt="${product.title}">
                    <div class="overlay">${product.title}</div>
                </div>
                <div id="product_${index}" class="product_popover" popover>
                <span class="close-popover" >X</span>
                 <img src=${product.images[0]} alt="Product Image" 
                      class="product-img" />
                <div class="product-details">
                  <div class="product-tags">
                  ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                  </div>
                  <h2 class="product-title">${product.title}</h2>
                  <p class="product-price">
                    Price: <span class="usd-price">$${product.price}</span> |
                    <span class="btc-price">${product.price_BTC} BTC</span>
                  </p>
                  <p class="product-description">
                  ${product.description}
                  </p>
                   <span class="add-to-cart" data-product-id=${product.id}>
                        Add to Cart</span>
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
  getAllProducts()
    .then((data) => displayProducts(data))
    .then(() => {
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach((btn) => {
        btn.addEventListener("click", addToCart);
      });
    });

  fetch("/api/ip")
    .then(resp => resp.text())
    .then(data => {
      const ip = new DOMParser().parseFromString(data, "text/xml").getElementsByTagName("ip")[0].childNodes[0].nodeValue;
      document.querySelector("#xml").innerHTML = ip;
    });

  const cartBtn = document.querySelector("#shopping-cart");
  cartBtn.addEventListener("click", displayCartContent);

  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", login);

  const registerForm = document.querySelector("#register-form");
  registerForm.addEventListener("submit", register);

  logoutButton.addEventListener("click", logout);

  userImg.addEventListener("click", navigateToAdminPage);

  const user = getUserCred();

  createAvatar(user?.firstname);

  checkoutBtn.addEventListener("click", (e) => checkoutProducts(user));

  if (user) {
    console.log(user);
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
    displayUserInfo(user); // Display user info including city and country
  } else {
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  }
};

const displayUserInfo = (user) => {
  document.querySelector("#user_info").innerHTML = `SilkyWay ${user?.country || ""}`;
};
