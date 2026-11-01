// Unit tests for the request validation utility (backend/utils/validate.js).
//
// These validators gate the two public write endpoints (POST /api/leads and
// POST /api/orders). The "valid" fixtures mirror the exact payload shapes
// the storefront sends (InquiryModal, BuildYourHome, Checkout) so a UI
// regression that breaks a real payload fails here first.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeIndianPhone,
  isValidIndianMobile,
  isValidEmail,
  validateLeadPayload,
  validateOrderPayload
} = require('../backend/utils/validate');

function fieldsOf(result) {
  return result.errors.map((e) => e.field);
}

describe('normalizeIndianPhone / isValidIndianMobile', () => {
  it('accepts a bare 10-digit mobile', () => {
    assert.equal(normalizeIndianPhone('9811778250'), '9811778250');
    assert.equal(isValidIndianMobile('9811778250'), true);
  });

  it('accepts +91 with spaces, as customers type it', () => {
    assert.equal(normalizeIndianPhone('+91 98117 78250'), '9811778250');
  });

  it('accepts the 91-prefixed and 0-prefixed forms', () => {
    assert.equal(normalizeIndianPhone('919811778250'), '9811778250');
    assert.equal(normalizeIndianPhone('09811778250'), '9811778250');
  });

  it('rejects numbers that are too short or too long', () => {
    assert.equal(isValidIndianMobile('981177825'), false);
    assert.equal(isValidIndianMobile('98117782501'), false);
  });

  it('rejects numbers not starting with 6-9 (not Indian mobiles)', () => {
    assert.equal(isValidIndianMobile('1234567890'), false);
    assert.equal(isValidIndianMobile('5811778250'), false);
  });

  it('rejects non-numeric and empty input', () => {
    assert.equal(isValidIndianMobile('abcdefghij'), false);
    assert.equal(isValidIndianMobile(''), false);
    assert.equal(isValidIndianMobile(null), false);
    assert.equal(isValidIndianMobile(undefined), false);
  });
});

describe('isValidEmail', () => {
  it('accepts ordinary addresses', () => {
    assert.equal(isValidEmail('rahul.sharma@example.com'), true);
    assert.equal(isValidEmail('9811778250@turnkeyclient.in'), true);
  });

  it('rejects malformed addresses', () => {
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isValidEmail('missing@tld'), false);
    assert.equal(isValidEmail('two@@example.com'), false);
    assert.equal(isValidEmail(''), false);
  });
});

// Mirrors src/components/InquiryModal.jsx handleSubmit.
const VALID_LEAD = {
  name: 'Rahul Sharma',
  phone: '9811778250',
  email: 'rahul@example.com',
  location: 'Faridabad',
  service: 'Bulk Sourcing & Delivery',
  details: 'Need 500 bags of cement delivered next week.'
};

// Mirrors src/pages/BuildYourHome.jsx: email auto-generated from the phone,
// extra fields present, details + message both set.
const VALID_TURNKEY_LEAD = {
  name: 'Amit Verma',
  phone: '+91 98117 78250',
  email: '9811778250@turnkeyclient.in',
  location: 'Greater Noida',
  city: 'Greater Noida',
  service: 'Build Your Home (Turnkey Construction - Plot + Construction)',
  details: 'Plot Size: 200 sq.yd\nEstimated Budget: ₹85 Lakh',
  message: 'Plot Size: 200 sq.yd\nEstimated Budget: ₹85 Lakh',
  status: 'New'
};

describe('validateLeadPayload', () => {
  it('accepts the InquiryModal payload shape', () => {
    const result = validateLeadPayload(VALID_LEAD);
    assert.equal(result.valid, true, JSON.stringify(result.errors));
  });

  it('accepts the BuildYourHome turnkey payload shape', () => {
    const result = validateLeadPayload(VALID_TURNKEY_LEAD);
    assert.equal(result.valid, true, JSON.stringify(result.errors));
  });

  it('accepts a lead without the optional email', () => {
    const { email, ...noEmail } = VALID_LEAD;
    assert.equal(validateLeadPayload(noEmail).valid, true);
  });

  it('rejects a non-object body', () => {
    assert.equal(validateLeadPayload(null).valid, false);
    assert.equal(validateLeadPayload('text').valid, false);
    assert.equal(validateLeadPayload([1, 2]).valid, false);
  });

  it('requires a name', () => {
    const result = validateLeadPayload({ ...VALID_LEAD, name: '  ' });
    assert.equal(result.valid, false);
    assert.ok(fieldsOf(result).includes('name'));
  });

  it('requires a valid phone', () => {
    for (const phone of ['', '12345', '1234567890', undefined]) {
      const result = validateLeadPayload({ ...VALID_LEAD, phone });
      assert.equal(result.valid, false, `phone=${phone} should fail`);
      assert.ok(fieldsOf(result).includes('phone'));
    }
  });

  it('rejects an invalid email when one is provided', () => {
    const result = validateLeadPayload({ ...VALID_LEAD, email: 'not-an-email' });
    assert.equal(result.valid, false);
    assert.ok(fieldsOf(result).includes('email'));
  });

  it('rejects an over-long message/details field', () => {
    const long = 'x'.repeat(5001);
    assert.equal(validateLeadPayload({ ...VALID_LEAD, details: long }).valid, false);
    assert.equal(validateLeadPayload({ ...VALID_LEAD, message: long }).valid, false);
    assert.equal(validateLeadPayload({ ...VALID_LEAD, details: 'x'.repeat(5000) }).valid, true);
  });
});

// Mirrors src/pages/Checkout.jsx orderData.
const VALID_ORDER = {
  id: 'ORD_123456',
  customer: {
    name: 'Rahul Sharma',
    phone: '9811778250',
    email: 'rahul@example.com',
    address: 'Sector 37',
    city: 'Faridabad',
    pincode: '121003'
  },
  items: [
    { productId: 'cem1', name: 'UltraTech 53 Grade OPC Cement 50kg', quantity: 40, price: 385 },
    { productId: 'stl1', name: 'TMT Steel Bar 12mm', quantity: 2.5, price: 4200 }
  ],
  subtotal: 25900,
  gst: 4662,
  total: 30562,
  paymentMethod: 'Cash on Site Delivery'
};

describe('validateOrderPayload', () => {
  it('accepts the Checkout payload shape (incl. fractional quantity)', () => {
    const result = validateOrderPayload(VALID_ORDER);
    assert.equal(result.valid, true, JSON.stringify(result.errors));
  });

  it('accepts qty in place of quantity and id in place of productId', () => {
    const order = {
      customer: { name: 'Rahul Sharma', phone: '9811778250' },
      items: [{ id: 'cem1', qty: 3 }]
    };
    assert.equal(validateOrderPayload(order).valid, true);
  });

  it('rejects a non-object body and an empty items array', () => {
    assert.equal(validateOrderPayload(null).valid, false);
    const result = validateOrderPayload({ ...VALID_ORDER, items: [] });
    assert.equal(result.valid, false);
    assert.ok(fieldsOf(result).includes('items'));
  });

  it('rejects items without a product reference', () => {
    const order = { ...VALID_ORDER, items: [{ name: 'Mystery', quantity: 1 }] };
    const result = validateOrderPayload(order);
    assert.equal(result.valid, false);
    assert.ok(fieldsOf(result).includes('items[0].productId'));
  });

  it('rejects zero, negative and non-numeric quantities', () => {
    for (const quantity of [0, -2, 'lots', NaN]) {
      const order = { ...VALID_ORDER, items: [{ productId: 'cem1', quantity }] };
      const result = validateOrderPayload(order);
      assert.equal(result.valid, false, `quantity=${quantity} should fail`);
      assert.ok(fieldsOf(result).includes('items[0].quantity'));
    }
  });

  it('requires customer name and a valid customer phone', () => {
    const noName = validateOrderPayload({ ...VALID_ORDER, customer: { phone: '9811778250' } });
    assert.equal(noName.valid, false);
    assert.ok(fieldsOf(noName).includes('customer.name'));

    const badPhone = validateOrderPayload({
      ...VALID_ORDER,
      customer: { name: 'Rahul Sharma', phone: '123' }
    });
    assert.equal(badPhone.valid, false);
    assert.ok(fieldsOf(badPhone).includes('customer.phone'));
  });

  it('rejects an invalid customer email when one is provided', () => {
    const order = {
      ...VALID_ORDER,
      customer: { ...VALID_ORDER.customer, email: 'nope' }
    };
    const result = validateOrderPayload(order);
    assert.equal(result.valid, false);
    assert.ok(fieldsOf(result).includes('customer.email'));
  });
});
