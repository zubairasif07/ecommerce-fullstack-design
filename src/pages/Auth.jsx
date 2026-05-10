import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Auth({ onNavigate, cartCount, searchQuery, onSearchChange, onLogin, onRegister, user, onLogout }) {
  const [tab, setTab] = useState("login");
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      onLogin?.(loginEmail, loginPassword);
    } else {
      alert("Please enter both email and password.");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regName && regEmail && regPassword) {
      onRegister?.(regName, regEmail, regPassword);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const inputStyle = {
    width: '100%', 
    padding: '15px', 
    borderRadius: '4px', 
    border: '1px solid #e0e0e0',
    marginBottom: '20px',
    fontSize: '15px'
  };

  const labelStyle = {
    display: 'block', 
    marginBottom: '8px', 
    fontSize: '14px', 
    color: '#4a4a4a',
    fontWeight: '500'
  };

  const linkStyle = {
    color: '#0056b3',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  if (user) {
    return (
      <>
        <Navbar activePage="auth" onNavigate={onNavigate} cartCount={cartCount} searchQuery={searchQuery} onSearchChange={onSearchChange} user={user} onLogout={onLogout} />
        <div className="container" style={{padding: '100px 0', textAlign: 'center', minHeight: '60vh'}}>
          <h2>Welcome, {user.name}!</h2>
          <p style={{color: '#6c757d', marginBottom: '30px'}}>You are currently signed in as {user.email}.</p>
          <button className="btn-primary" onClick={onLogout}>Sign Out</button>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    );
  }

  return (
    <>
      <Navbar
        activePage="auth"
        onNavigate={onNavigate}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        user={user}
        onLogout={onLogout}
      />

      <section style={{background: '#f5f5f5', padding: '60px 0', minHeight: 'calc(100vh - 200px)'}}>
        <div className="container" style={{maxWidth: '1000px'}}>
          <div style={{background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', boxShadow: '0 10px 40px rgba(0,0,0,0.08)'}}>
            
            {/* Left Side - Image & Copy */}
            <div style={{flex: 1, background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)', color: '#fff', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'relative', zIndex: 1}}>
                <h2 style={{fontSize: '36px', fontWeight: '700', marginBottom: '20px'}}>Welcome to ShopSphere</h2>
                <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6}}>Sign in to access your personalized shopping experience, track orders, and discover exclusive premium products.</p>
              </div>
              {/* Decorative elements */}
              <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%'}}></div>
              <div style={{position: 'absolute', bottom: '-5%', left: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%'}}></div>
            </div>

            {/* Right Side - Form */}
            <div style={{flex: 1, padding: '60px'}}>
              <div style={{display: 'flex', gap: '30px', marginBottom: '40px', borderBottom: '1px solid #e0e0e0'}}>
                <button
                  type="button"
                  style={{
                    background: 'none', border: 'none', padding: '0 0 15px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer',
                    color: tab === "login" ? '#0056b3' : '#a0a0a0',
                    borderBottom: tab === "login" ? '3px solid #0056b3' : '3px solid transparent',
                    marginBottom: '-2px'
                  }}
                  onClick={() => setTab("login")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  style={{
                    background: 'none', border: 'none', padding: '0 0 15px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer',
                    color: tab === "register" ? '#0056b3' : '#a0a0a0',
                    borderBottom: tab === "register" ? '3px solid #0056b3' : '3px solid transparent',
                    marginBottom: '-2px'
                  }}
                  onClick={() => setTab("register")}
                >
                  Register
                </button>
              </div>

              {tab === "login" ? (
                <form onSubmit={handleLoginSubmit}>
                  <div>
                    <label style={labelStyle}>Email address</label>
                    <input type="email" style={inputStyle} placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={{...labelStyle, display: 'flex', justifyContent: 'space-between'}}>
                      Password
                      <button type="button" style={linkStyle} onClick={() => setTab("reset")}>Forgot?</button>
                    </label>
                    <input type="password" style={inputStyle} placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-primary" style={{width: '100%', padding: '15px', fontSize: '16px', marginTop: '10px'}}>
                    Sign In
                  </button>
                </form>
              ) : tab === "reset" ? (
                <form onSubmit={(e) => { e.preventDefault(); alert("Reset link sent!"); setTab("login"); }}>
                  <p style={{color: '#6c757d', marginBottom: '20px'}}>Enter your email address and we'll send you a link to reset your password.</p>
                  <div>
                    <label style={labelStyle}>Email address</label>
                    <input type="email" style={inputStyle} placeholder="you@example.com" />
                  </div>
                  <button type="submit" className="btn-primary" style={{width: '100%', padding: '15px', fontSize: '16px', marginTop: '10px', marginBottom: '20px'}}>
                    Send Reset Link
                  </button>
                  <div style={{textAlign: 'center'}}>
                    <button type="button" style={linkStyle} onClick={() => setTab("login")}>Back to Sign In</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div>
                    <label style={labelStyle}>Full name</label>
                    <input type="text" style={inputStyle} placeholder="John Doe" value={regName} onChange={(e) => setRegName(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email address</label>
                    <input type="email" style={inputStyle} placeholder="you@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <input type="password" style={inputStyle} placeholder="Create a strong password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                  </div>
                  <p style={{fontSize: '13px', color: '#6c757d', marginBottom: '20px'}}>
                    By registering, you agree to our <a href="#terms" style={linkStyle}>Terms of Service</a> and <a href="#privacy" style={linkStyle}>Privacy Policy</a>.
                  </p>
                  <button type="submit" className="btn-primary" style={{width: '100%', padding: '15px', fontSize: '16px'}}>
                    Create Account
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
