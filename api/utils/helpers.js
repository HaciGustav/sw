const assignID = (data) => {
  if (data.length < 1) return 0;

  const tempID = data.reduce((acc, i) => (i.id > acc.id ? i : acc))?.id;
  return tempID + 1;
};

module.exports = { assignID };
