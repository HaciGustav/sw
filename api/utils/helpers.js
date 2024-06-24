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

module.exports = { assignID, convertCurrency };
