const assignID = (data) => {
  if (data.length < 1) return 0;

  const tempID = data.reduce((acc, i) => (i.id > acc.id ? i : acc))?.id;
  return tempID + 1;
};

const convertCurrency = async (products) => {
  const url = "https://api.coinconvert.net/convert/usd/btc?amount=";
  const editedProducts = [];
  for (const product of products) {
    const response = await fetch(url + product.price).then((res) => {
      if (res.ok) return res.json();
      return { BTC: 0 };
    });

    editedProducts.push({ ...product._doc, price_BTC: response.BTC });
  }
  return editedProducts;
};
/* const getAvatar = async (firstname, lastname) => {
  const defaultAvatar = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="63" height="63" rx="31.5" fill="white"/>
<rect x="0.5" y="0.5" width="63" height="63" rx="31.5" stroke="#ECECEC"/>
<path d="M18.6667 47C18.6667 42.3976 24.6362 38.6666 32 38.6666C39.3638 38.6666 45.3334 42.3976 45.3334 47" stroke="#14181F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32 33.6667C36.6024 33.6667 40.3334 29.9357 40.3334 25.3333C40.3334 20.731 36.6024 17 32 17C27.3976 17 23.6667 20.731 23.6667 25.3333C23.6667 29.9357 27.3976 33.6667 32 33.6667Z" stroke="#14181F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const url = `https://ui-avatars.com/api/?name=
    ${firstname} + ${lastname}
  &background=random&rounded=true&format=svg`;
  const url2 = `https://robohash.org/` + firstname;
  const response = await fetch(url2, {
    headers: {
      "Content-Type": "application/json",
      Accept: "image/svg+xml",
    },
  }).then((res) => {
    // console.log(res.text());
    if (res.ok) return res.text();
    // return defaultAvatar;
  });
  // console.log(response);
  const buffer = Buffer.from(response).toString("base64url");
  console.log(buffer);
  return "buffer";
}; */
const getAvatar = async (firstname, lastname) => {
  const url2 = `https://robohash.org/` + firstname;
  const response = await fetch(url2)
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));
  console.log(response);
  return "";
};

module.exports = { assignID, convertCurrency, getAvatar };
