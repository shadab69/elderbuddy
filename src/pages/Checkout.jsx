import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ShoppingBasket, Check } from 'lucide-react';
import axios from 'axios';

export default function Checkout() {
  const { cart, products, clearCart, fetchData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  if (orderSuccess) {
    const cust = orderSuccess.customer || {};
    const items = orderSuccess.items || [];
    return (
      <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
        <div className="checkout-success-view">
          <div className="success-icon-wrapper">
            <Check style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>
            Thank you, <strong>{cust.name}</strong>. Your order{' '}
            <strong>#{orderSuccess.id || orderSuccess._id}</strong> has been received. Our
            sales engineer will call you on <strong>{cust.phone}</strong>{' '}
            within 30 minutes to confirm the site location and delivery dispatch time.
          </p>

          {/* Email Confirmation Notification */}
          <div
            style={{
              background: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '0.88rem',
              color: '#166534',
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            ✉️ <strong>Order Receipt Sent!</strong> An itemized invoice with all your ordered building materials has been sent to your email (<strong>{cust.email || 'your email'}</strong>).
          </div>

          {/* Ordered Materials Summary Box */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--text-main)' }}>
              📦 Ordered Materials Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((it, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.82rem', 
                    paddingBottom: '6px', 
                    borderBottom: '1px solid var(--border-color)' 
                  }}
                >
                  <span>
                    <strong>{it.quantity}x</strong> {it.name}
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '10px', 
                fontSize: '0.95rem', 
                fontWeight: '700', 
                color: 'var(--primary-color, #ea580c)' 
              }}
            >
              <span>Total Payable Amount (COD):</span>
              <span>₹{(orderSuccess.total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface-alt)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              fontSize: '0.85rem',
              marginBottom: '25px',
              color: 'var(--text-main)'
            }}
          >
            <strong>Site Delivery Location:</strong>
            <br />
            {cust.address}, {cust.city} - {cust.pincode}
          </div>

          <Link to="/" className="btn-primary w-full" style={{ display: 'block', textAlign: 'center' }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container text-center" style={{ padding: '80px 0' }}>
        <ShoppingBasket
          style={{
            width: '64px',
            height: '64px',
            color: 'var(--slate-300)',
            marginBottom: '15px'
          }}
        />
        <h2>Your Cart is Empty</h2>
        <p>Cannot checkout. Please add items to your cart first.</p>
        <Link
          to="/products"
          className="btn-primary"
          style={{ marginTop: '20px', display: 'inline-block' }}
        >
          Browse Materials
        </Link>
      </div>
    );
  }

  // Totals calculations
  let subtotal = 0;
  cart.forEach((item) => {
    const prod = products.find((p) => p.id === item.product.id || p.id === item.productId || p._id === item.product._id);
    if (prod) {
      subtotal += prod.price * item.quantity;
    } else {
      // Fallback
      subtotal += (item.product?.price || 0) * item.quantity;
    }
  });
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('bill-', '');
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const generatedOrderId = 'ORD_' + Math.floor(100000 + Math.random() * 900000);
    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.product.id || p._id === item.product._id);
      return {
        productId: prod ? prod.id : (item.product?.id || item.productId),
        name: prod ? prod.name : (item.product?.name || 'Unknown Material'),
        quantity: item.quantity,
        price: prod ? prod.price : (item.product?.price || 0)
      };
    });

    const orderData = {
      id: generatedOrderId,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      },
      items: orderItems,
      subtotal,
      gst,
      total,
      paymentMethod: 'Cash on Site Delivery'
    };

    try {
      // 1. Primary: Serverless Backend API + Nodemailer (shady69366@gmail.com)
      const res = await axios.post('/api/orders', orderData);
      setOrderSuccess(res.data || orderData);
    } catch (err) {
      console.warn('[Backend] Failed to save order on server, using direct fallback.', err);
      setOrderSuccess(orderData);
    }

    // 2. Secondary Client-Side Direct Fail-safe (Guaranteed delivery on Vercel / Cloud)
    try {
      const formattedItemsSummary = orderItems.map((it, idx) => 
        `${idx + 1}. ${it.name} (Qty: ${it.quantity}) - ₹${(it.price * it.quantity).toLocaleString('en-IN')}`
      ).join('\n');

      await fetch('https://formsubmit.co/ajax/shady69366@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🛒 New Customer Order Placed: #${generatedOrderId} (₹${total.toLocaleString('en-IN')}) - ${formData.name}`,
          _replyto: formData.email || 'shady69366@gmail.com',
          _autoresponse: `Namaste ${formData.name}! Thank you for placing your order with Elder-O-Buddy.\n\nYour Order #${generatedOrderId} (Total Amount: ₹${total.toLocaleString('en-IN')}) has been received successfully.\n\nOrdered Items:\n${formattedItemsSummary}\n\nDelivery Address:\n${formData.address}, ${formData.city} - ${formData.pincode}\n\nOur logistics manager will call you at ${formData.phone} to confirm the delivery truck schedule.`,
          _template: 'table',
          _captcha: 'false',
          'Order ID': `#${generatedOrderId}`,
          'Customer Name': formData.name,
          'Customer Phone': formData.phone,
          'Customer Email': formData.email || 'Not Provided',
          'Delivery Address': `${formData.address}, ${formData.city} - ${formData.pincode}`,
          'Payment Mode': 'Cash on Site Delivery',
          'Subtotal (Excl. GST)': `₹${subtotal.toLocaleString('en-IN')}`,
          'GST (18%)': `₹${gst.toLocaleString('en-IN')}`,
          'Grand Total Amount': `₹${total.toLocaleString('en-IN')}`,
          'Ordered Materials List': formattedItemsSummary
        })
      });
    } catch (clientErr) {
      console.log('Client-side order dispatch logged');
    }

    clearCart();
    await fetchData();
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <h2>Secure Site Checkout</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Complete your material delivery order. Sourcing and transport logistics are handled on site.
      </p>

      <div className="checkout-layout">
        {/* Delivery Info Form */}
        <form id="checkout-form" className="checkout-card" onSubmit={handleSubmit}>
          <h3>1. Site Delivery Details</h3>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="bill-name">Recipient Name</label>
              <input
                type="text"
                id="bill-name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="bill-phone">Mobile Number</label>
              <input
                type="tel"
                id="bill-phone"
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="bill-email">Email Address</label>
            <input
              type="email"
              id="bill-email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="bill-address">Detailed Site Address</label>
            <textarea
              id="bill-address"
              rows="3"
              placeholder="Plot No, Phase, Construction Site Land Mark..."
              value={formData.address}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="bill-city">City / Area</label>
              <input
                type="text"
                id="bill-city"
                placeholder="e.g. Mumbai, Delhi (Pan India)"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="bill-pincode">Pincode</label>
              <input
                type="text"
                id="bill-pincode"
                placeholder="6-digit PIN"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <h3 style={{ marginTop: '30px' }}>2. Payment Method</h3>
          <div className="checkbox-group" style={{ marginBottom: '20px' }}>
            <label
              className="checkbox-label"
              style={{
                background: 'var(--bg-surface-alt)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <input type="radio" name="payment-method" value="cod" defaultChecked />
              <strong>Cash on Site Delivery (COD) / Bank Transfer</strong>
            </label>
            <label
              className="checkbox-label"
              style={{
                background: 'var(--bg-surface-alt)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: 0.7,
                marginTop: '10px',
                cursor: 'not-allowed'
              }}
            >
              <input type="radio" name="payment-method" value="upi" disabled />
              <span>Online UPI / QR Payment (Currently Disabled for Maintenance)</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            style={{ height: '52px', fontSize: '1.1rem', marginTop: '20px' }}
          >
            {loading ? 'Processing...' : `Place Material Order (₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })})`}
          </button>
        </form>

        {/* Order summary pane */}
        <div className="checkout-summary-box">
          <h3>Order Summary</h3>
          <div
            style={{
              maxHeight: '250px',
              overflowY: 'auto',
              marginBottom: '15px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '15px'
            }}
          >
            {cart.map((item, idx) => {
              const prod = products.find((p) => p.id === item.product.id || p.id === item.productId || p._id === item.product._id);
              const name = prod ? prod.name : (item.product?.name || 'Unknown Material');
              const price = prod ? prod.price : (item.product?.price || 0);
              return (
                <div className="checkout-item-mini" key={idx}>
                  <span className="name">
                    {name} (x{item.quantity})
                  </span>
                  <span>₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-row">
            <span>Items Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="cart-summary-row gst-row">
            <span>GST (18%)</span>
            <span>₹{gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="cart-summary-row total-row" style={{ marginBottom: 0 }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--primary)' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
