const productModel = (id, name, quantity, unit_price) => {
  return {
    id,
    name,
    quantity: parseInt(quantity),
    unit_price: parseFloat(unit_price),
    timestamp: Date.now(),
  };
};

module.exports = productModel;
