// ---------------------------------------------------------------------------
// Request payload validation for the public write endpoints.
//
// Pure functions only: no Express, no database, no I/O. Each validator takes
// the parsed JSON body and returns:
//   { valid: true,  errors: [] }
//   { valid: false, errors: [{ field, message }, ...] }
//
// The rules mirror what the storefront actually sends (InquiryModal,
// BuildYourHome and Checkout) and what the Mongoose models require, so a
// payload the UI produces always passes, while malformed or hostile
// payloads are rejected by the controllers with HTTP 400 before any
// database write or email is attempted.
// ---------------------------------------------------------------------------

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SHORT_TEXT_LENGTH = 200; // service, location, city, etc.
const MAX_MESSAGE_LENGTH = 5000; // details / message free-text fields
const MAX_ORDER_ITEMS = 100;
const MAX_ITEM_QUANTITY = 100000;

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asTrimmedString(value) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

// Normalises an Indian mobile number to its bare 10-digit form, or returns
// null when the input cannot be one. Accepts the shapes customers actually
// type: "9811778250", "+91 98117 78250", "919811778250", "09811778250".
function normalizeIndianPhone(raw) {
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  let digits = String(raw).replace(/[\s\-()]/g, '');
  if (digits.startsWith('+91')) digits = digits.slice(3);
  else if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

function isValidIndianMobile(raw) {
  return normalizeIndianPhone(raw) !== null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(raw) {
  if (typeof raw !== 'string') return false;
  const email = raw.trim();
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

// --- shared field checks (push into `errors`) -------------------------------

function checkName(errors, value, field) {
  const name = asTrimmedString(value);
  if (!name) {
    errors.push({ field, message: 'Name is required.' });
  } else if (name.length < 2) {
    errors.push({ field, message: 'Name must be at least 2 characters long.' });
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.push({ field, message: `Name must be at most ${MAX_NAME_LENGTH} characters long.` });
  }
}

function checkPhone(errors, value, field) {
  if (value === undefined || value === null || asTrimmedString(value) === '') {
    errors.push({ field, message: 'Phone number is required.' });
  } else if (!isValidIndianMobile(value)) {
    errors.push({ field, message: 'Phone number must be a valid 10-digit Indian mobile number.' });
  }
}

function checkOptionalEmail(errors, value, field) {
  if (value === undefined || value === null || asTrimmedString(value) === '') return;
  if (!isValidEmail(value)) {
    errors.push({ field, message: 'Email address is not valid.' });
  }
}

function checkOptionalShortText(errors, value, field, label) {
  if (value === undefined || value === null) return;
  if (typeof value !== 'string') {
    errors.push({ field, message: `${label} must be text.` });
  } else if (value.length > MAX_SHORT_TEXT_LENGTH) {
    errors.push({ field, message: `${label} must be at most ${MAX_SHORT_TEXT_LENGTH} characters long.` });
  }
}

function checkOptionalMessage(errors, value, field, label) {
  if (value === undefined || value === null) return;
  if (typeof value !== 'string') {
    errors.push({ field, message: `${label} must be text.` });
  } else if (value.length > MAX_MESSAGE_LENGTH) {
    errors.push({ field, message: `${label} must be at most ${MAX_MESSAGE_LENGTH} characters long.` });
  }
}

// --- lead payloads (POST /api/leads) ----------------------------------------

function validateLeadPayload(body) {
  if (!isPlainObject(body)) {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object.' }] };
  }
  const errors = [];
  checkName(errors, body.name, 'name');
  checkPhone(errors, body.phone, 'phone');
  checkOptionalEmail(errors, body.email, 'email');
  checkOptionalShortText(errors, body.service, 'service', 'Service');
  checkOptionalShortText(errors, body.location, 'location', 'Location');
  checkOptionalMessage(errors, body.details, 'details', 'Details');
  checkOptionalMessage(errors, body.message, 'message', 'Message');
  return { valid: errors.length === 0, errors };
}

// --- order payloads (POST /api/orders) --------------------------------------

function itemProductId(item) {
  if (!isPlainObject(item)) return '';
  if (item.productId !== undefined && item.productId !== null) return asTrimmedString(item.productId);
  if (item.id !== undefined && item.id !== null) return asTrimmedString(item.id);
  if (isPlainObject(item.product)) return asTrimmedString(item.product.id);
  return '';
}

function itemQuantity(item) {
  if (!isPlainObject(item)) return NaN;
  const raw = item.quantity !== undefined ? item.quantity : item.qty;
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string' && raw.trim() !== '') return Number(raw);
  return NaN;
}

function validateOrderPayload(body) {
  if (!isPlainObject(body)) {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object.' }] };
  }
  const errors = [];

  // Checkout sends customer as a nested object; fall back to top-level
  // name/phone for robustness with older clients.
  const customer = isPlainObject(body.customer) ? body.customer : body;
  checkName(errors, customer.name, 'customer.name');
  checkPhone(errors, customer.phone, 'customer.phone');
  checkOptionalEmail(errors, customer.email, 'customer.email');

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push({ field: 'items', message: 'Order must contain at least one item.' });
  } else if (body.items.length > MAX_ORDER_ITEMS) {
    errors.push({ field: 'items', message: `Order must contain at most ${MAX_ORDER_ITEMS} items.` });
  } else {
    body.items.forEach((item, index) => {
      if (!isPlainObject(item)) {
        errors.push({ field: `items[${index}]`, message: 'Each order item must be an object.' });
        return;
      }
      if (!itemProductId(item)) {
        errors.push({ field: `items[${index}].productId`, message: 'Each order item must reference a product.' });
      }
      const qty = itemQuantity(item);
      if (!Number.isFinite(qty) || qty <= 0) {
        errors.push({ field: `items[${index}].quantity`, message: 'Each order item must have a quantity greater than 0.' });
      } else if (qty > MAX_ITEM_QUANTITY) {
        errors.push({ field: `items[${index}].quantity`, message: `Quantity must be at most ${MAX_ITEM_QUANTITY}.` });
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  normalizeIndianPhone,
  isValidIndianMobile,
  isValidEmail,
  validateLeadPayload,
  validateOrderPayload
};
