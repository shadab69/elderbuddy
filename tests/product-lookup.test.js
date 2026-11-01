// Regression tests for the cart -> checkout price corruption bug.
//
// Root cause: Checkout.jsx resolved cart items with
//   products.find(p => p.id === item.product.id || ... || p._id === item.product._id)
// Seed/fallback products (INITIAL_PRODUCTS, products.json) have `id` but no
// `_id`, so the last clause was `undefined === undefined` -> true for the
// FIRST catalogue product. Every cart line was priced/named as that first
// product at checkout and in the order payload (cart drawer, which matched
// strictly on `id`, showed the correct prices). These tests pin the fixed
// behaviour of the shared matcher in src/utils/productLookup.js using the
// app's real seed catalogue.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { findCartProduct } = require('../src/utils/productLookup.js');
const { INITIAL_PRODUCTS } = require('../backend/data/data.js');

const byId = (id) => INITIAL_PRODUCTS.find((p) => p.id === id);

// The exact money math both CartDrawer and Checkout perform.
function totals(products, cart) {
  let subtotal = 0;
  for (const item of cart) {
    const prod = findCartProduct(products, item);
    if (prod) subtotal += prod.price * item.quantity;
    else subtotal += (item.product?.price || 0) * item.quantity;
  }
  const gst = subtotal * 0.18;
  return { subtotal, gst, total: subtotal + gst };
}

const round2 = (n) => Math.round(n * 100) / 100;

describe('findCartProduct with _id-less seed products (fallback mode)', () => {
  it('reproduces the reported scenario: cement + hd10 keep their own prices', () => {
    const cart = [
      { product: byId('p1'), quantity: 10 }, // UltraTech OPC 53, Rs 430/bag
      { product: byId('hd10'), quantity: 2 } // Rs 1350
    ];
    assert.equal(findCartProduct(INITIAL_PRODUCTS, cart[0]).id, 'p1');
    assert.equal(findCartProduct(INITIAL_PRODUCTS, cart[1]).id, 'hd10');

    const t = totals(INITIAL_PRODUCTS, cart);
    assert.equal(round2(t.subtotal), 7000);
    assert.equal(round2(t.gst), 1260);
    assert.equal(round2(t.total), 8260);
  });

  it('resolves EVERY catalogue product to itself, never to products[0]', () => {
    for (const product of INITIAL_PRODUCTS) {
      const found = findCartProduct(INITIAL_PRODUCTS, { product, quantity: 1 });
      assert.ok(found, `no match for ${product.id}`);
      assert.equal(found.id, product.id, `cart item for ${product.id} resolved to ${found.id}`);
      assert.equal(found.price, product.price);
    }
  });

  it('order payload built from the matcher carries the bought products, not the first one', () => {
    const cart = [
      { product: byId('p1'), quantity: 10 },
      { product: byId('hd10'), quantity: 2 }
    ];
    const orderItems = cart.map((item) => {
      const prod = findCartProduct(INITIAL_PRODUCTS, item);
      return {
        productId: prod ? prod.id : item.product?.id,
        name: prod ? prod.name : 'Unknown Material',
        quantity: item.quantity,
        price: prod ? prod.price : 0
      };
    });
    assert.deepEqual(
      orderItems.map((i) => [i.productId, i.price]),
      [['p1', 430], ['hd10', 1350]]
    );
    const orderSubtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    assert.equal(round2(orderSubtotal), 7000);
    assert.equal(round2(orderSubtotal * 1.18), 8260);
  });
});

describe('findCartProduct with MongoDB-shaped products (with _id)', () => {
  const mongoProducts = INITIAL_PRODUCTS.slice(0, 5).map((p, i) => ({ ...p, _id: `mongo-${i}` }));

  it('matches by business id', () => {
    const item = { product: { ...mongoProducts[3] }, quantity: 1 };
    assert.equal(findCartProduct(mongoProducts, item).id, mongoProducts[3].id);
  });

  it('matches by _id when the stored cart product predates an id change', () => {
    const item = { product: { id: 'stale-id', _id: 'mongo-2' }, quantity: 1 };
    assert.equal(findCartProduct(mongoProducts, item).id, mongoProducts[2].id);
  });

  it('does not match a product solely because both _ids are missing', () => {
    const noIds = INITIAL_PRODUCTS.slice(0, 3).map((p) => ({ ...p }));
    const stranger = { product: { id: 'not-in-list' }, quantity: 1 };
    assert.equal(findCartProduct(noIds, stranger), undefined);
  });
});

describe('findCartProduct edge cases', () => {
  it('returns undefined for unknown products so caller fallbacks still apply', () => {
    assert.equal(findCartProduct(INITIAL_PRODUCTS, { product: { id: 'nope' }, quantity: 1 }), undefined);
    assert.equal(findCartProduct(INITIAL_PRODUCTS, { productId: 'nope', quantity: 1 }), undefined);
  });

  it('supports the flat { productId, quantity } cart shape', () => {
    const found = findCartProduct(INITIAL_PRODUCTS, { productId: 'p1', quantity: 4 });
    assert.equal(found.id, 'p1');
  });

  it('handles null/garbage input without throwing', () => {
    assert.equal(findCartProduct(INITIAL_PRODUCTS, null), undefined);
    assert.equal(findCartProduct(null, { product: { id: 'p1' } }), undefined);
    assert.equal(findCartProduct(INITIAL_PRODUCTS, {}), undefined);
  });
});
