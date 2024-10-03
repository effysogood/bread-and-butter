function filterFormatOrder(order) {
  const { _id, products, orderer, total_price, order_status, createdAt } =
    order;
  return { _id, products, orderer, total_price, order_status, createdAt };
}

function filterResponseOrder(toResponse) {
  if (!toResponse) return null;
  if (Array.isArray(toResponse)) {
    const filteredList = toResponse.map((order) => filterFormatOrder(order));
    return filteredList;
  }
  return filterFormatOrder(toResponse);
}

function filterFormatUser(user) {
  const { _id, email, name, address, phone } = user;
  return {
    _id,
    email,
    name,
    address,
    phone,
  };
}

function filterResponseUser(toResponse) {
  if (!toResponse) return null;
  if (Array.isArray(toResponse)) {
    const filteredList = toResponse.map((user) => filterFormatUser(user));
    return filteredList;
  }
  return filterFormatUser(toResponse);
}

module.exports = {
  filterResponseOrder,
  filterResponseUser,
};
