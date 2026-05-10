import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';

const PageLayout = ({ title, children, onNavigate, cartCount, searchQuery, onSearchChange, user, onLogout }) => (
  <>
    <Navbar onNavigate={onNavigate} cartCount={cartCount} searchQuery={searchQuery} onSearchChange={onSearchChange} user={user} onLogout={onLogout} />
    <div className="container" style={{ padding: '60px 0', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', color: '#1a1a1a' }}>{title}</h1>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #e0e0e0', lineHeight: '1.6', color: '#4a4a4a' }}>
        {children}
      </div>
    </div>
    <Footer onNavigate={onNavigate} />
  </>
);

// ... existing code ...

export const MyOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.user) {
      api.getOrders().then(data => {
        setOrders(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [props.user]);

  if (!props.user) {
    return (
      <PageLayout title="My Orders" {...props}>
        <p>Sign in to view your order history.</p>
        <button className="btn-primary" onClick={() => props.onNavigate?.('auth')}>Sign In</button>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="My Orders" {...props}>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {orders.map(order => (
            <div key={order.id} style={{border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                <strong>Order #{order.id}</strong>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px'}}>
                {order.items.map(item => (
                  <div key={item.id} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>{item.quantity}x {item.product?.name || 'Unknown Product'}</span>
                    <span>${parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                <span style={{fontWeight: 'bold', textTransform: 'capitalize', color: order.status === 'completed' ? 'green' : 'orange'}}>{order.status}</span>
                <strong style={{fontSize: '18px'}}>${parseFloat(order.total).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export const Contact = (props) => (
  <PageLayout title="Contact Us" {...props}>
    <h3>We're here to help!</h3>
    <p>If you have any questions or concerns about your order, our products, or our services, please don't hesitate to reach out.</p>
    <div style={{ marginTop: '20px', display: 'flex', gap: '30px' }}>
      <div>
        <strong>Email Support</strong><br/>
        <a href="mailto:support@shopsphere.com" style={{ color: '#0056b3' }}>support@shopsphere.com</a>
      </div>
      <div>
        <strong>Phone Support</strong><br/>
        1-800-SHOP-SPHERE<br/>
        Mon-Fri, 9am - 6pm EST
      </div>
    </div>
  </PageLayout>
);

export const Returns = (props) => (
  <PageLayout title="Returns & Order Status" {...props}>
    <h3>Track Your Order</h3>
    <p>Enter your order number and email address to track your shipment.</p>
    <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', marginBottom: '30px' }}>
      <input type="text" placeholder="Order Number" style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
      <button className="btn-primary" style={{ padding: '10px 20px' }}>Track</button>
    </div>
    <h3>Return Policy</h3>
    <p>We offer a hassle-free 30-day return policy on all unworn, unused items in their original packaging. Electronic items must remain sealed. Refunds are processed within 5-7 business days of receiving the returned item.</p>
  </PageLayout>
);

export const Drivers = (props) => (
  <PageLayout title="Drivers & Software" {...props}>
    <h3>Find Drivers for Your Device</h3>
    <p>Keep your products running smoothly with the latest drivers and software updates.</p>
    <div style={{ display: 'flex', gap: '10px', maxWidth: '500px', marginTop: '20px' }}>
      <input type="text" placeholder="Search by product name or serial number..." style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
      <button className="btn-primary" style={{ padding: '10px 20px' }}>Search</button>
    </div>
  </PageLayout>
);

export const Warranty = (props) => (
  <PageLayout title="Warranty Check" {...props}>
    <h3>Check Your Warranty Status</h3>
    <p>All ShopSphere products come with a standard 1-year limited warranty. Enter your device's serial number below to check its current warranty status and coverage options.</p>
    <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', marginTop: '20px' }}>
      <input type="text" placeholder="Serial Number" style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
      <button className="btn-primary" style={{ padding: '10px 20px' }}>Check Status</button>
    </div>
  </PageLayout>
);

export const About = (props) => (
  <PageLayout title="About ShopSphere" {...props}>
    <h3>Our Story</h3>
    <p>Founded in 2026, ShopSphere was built on a simple premise: premium tech and lifestyle products should be accessible, beautifully presented, and backed by world-class customer support.</p>
    <p>Today, we serve millions of customers worldwide, partnering with top brands to deliver uncompromising quality right to your doorstep.</p>
  </PageLayout>
);

export const Newsroom = (props) => (
  <PageLayout title="Newsroom" {...props}>
    <h3>Latest Updates</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
        <span style={{ color: '#0056b3', fontSize: '14px', fontWeight: 'bold' }}>PRESS RELEASE</span>
        <h4>ShopSphere Announces Global Expansion into European Markets</h4>
        <p style={{ color: '#666', fontSize: '14px' }}>April 28, 2026</p>
      </li>
      <li style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
        <span style={{ color: '#0056b3', fontSize: '14px', fontWeight: 'bold' }}>COMPANY NEWS</span>
        <h4>Q1 2026 Financial Results Exceed Expectations</h4>
        <p style={{ color: '#666', fontSize: '14px' }}>April 15, 2026</p>
      </li>
    </ul>
  </PageLayout>
);

export const Investors = (props) => (
  <PageLayout title="Investor Relations" {...props}>
    <h3>Investor Information</h3>
    <p>Welcome to the ShopSphere Investor Relations portal. Here you will find our latest financial reports, SEC filings, and corporate governance documents.</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
      <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h4>Q1 2026 Earnings Report</h4>
        <a href="#download" style={{ color: '#0056b3' }}>Download PDF &darr;</a>
      </div>
      <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h4>2025 Annual Report</h4>
        <a href="#download" style={{ color: '#0056b3' }}>Download PDF &darr;</a>
      </div>
    </div>
  </PageLayout>
);

export const Careers = (props) => (
  <PageLayout title="Careers" {...props}>
    <h3>Join Our Team</h3>
    <p>At ShopSphere, we are always looking for passionate, driven individuals to join our growing team. We offer competitive salaries, comprehensive benefits, and a culture of continuous learning.</p>
    <h4 style={{ marginTop: '30px' }}>Open Positions</h4>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li style={{ padding: '15px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Senior Frontend Engineer</strong><br/>
          <span style={{ color: '#666', fontSize: '14px' }}>Remote / Engineering</span>
        </div>
        <button className="btn-primary">Apply</button>
      </li>
      <li style={{ padding: '15px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Customer Support Specialist</strong><br/>
          <span style={{ color: '#666', fontSize: '14px' }}>New York / Customer Success</span>
        </div>
        <button className="btn-primary">Apply</button>
      </li>
    </ul>
  </PageLayout>
);

export const Favorites = (props) => (
  <PageLayout title="Favorites" {...props}>
    <p>Sign in to view your favorite items.</p>
    <button className="btn-primary" onClick={() => props.onNavigate?.('auth')}>Sign In</button>
  </PageLayout>
);



export const UserAgreement = (props) => (
  <PageLayout title="User Agreement" {...props}>
    <h3>Terms of Service</h3>
    <p>By using ShopSphere, you agree to these conditions. Please read them carefully.</p>
  </PageLayout>
);

export const Partnership = (props) => (
  <PageLayout title="Partnership" {...props}>
    <h3>Partner with ShopSphere</h3>
    <p>Interested in becoming a supplier or affiliate? Contact us to learn more about partnership opportunities.</p>
  </PageLayout>
);

export const PrivacyPolicy = (props) => (
  <PageLayout title="Privacy Policy" {...props}>
    <h3>Your Privacy Matters</h3>
    <p>We respect your privacy and are committed to protecting your personal data.</p>
  </PageLayout>
);
