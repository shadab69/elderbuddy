// ---------------------------------------------------------------------------
// findCartProduct — resolve a cart item to its catalogue product, safely.
//
// Cart items store the product as it was when added ({ product, quantity }),
// and products can come from two sources with different shapes:
//   - MongoDB API responses carry BOTH `id` (business id) and `_id`.
//   - Seed/fallback data (INITIAL_PRODUCTS, products.json) carries ONLY `id`.
//
// The previous inline lookups in Checkout.jsx included the clause
// `p._id === item.product._id`. When both sides are _id-less, that is
// `undefined === undefined` -> true for the FIRST product in the array, so
// every cart line was priced and named as the first catalogue product
// (cart total correct in the drawer, garbage at checkout). This helper only
// compares a field when BOTH sides actually have it.
// ---------------------------------------------------------------------------

export function cartItemProductId(item) {
  if (!item || typeof item !== 'object') return undefined;
  if (item.product && item.product.id != null) return item.product.id;
  if (item.productId != null) return item.productId;
  return undefined;
}

export function cartItemMongoId(item) {
  if (!item || typeof item !== 'object') return undefined;
  if (item.product && item.product._id != null) return item.product._id;
  if (item._id != null) return item._id;
  return undefined;
}

export function findCartProduct(products, item) {
  if (!Array.isArray(products) || !item) return undefined;
  const pid = cartItemProductId(item);
  const mongoId = cartItemMongoId(item);
  if (pid == null && mongoId == null) return undefined;
  return products.find((p) => {
    if (!p) return false;
    if (pid != null && p.id != null && p.id === pid) return true;
    // Only compare Mongo ids when both sides genuinely have one — never
    // let two missing ids "match".
    if (mongoId != null && p._id != null && p._id === mongoId) return true;
    return false;
  });
}

export default findCartProduct;
