import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import CatLogo from "./CatLogo";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const scrollTo = (id) => {
    if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
    } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          {/* Left: Logo */}
          <div className="nav-left">
            <button
              className="hamburger"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle menu"
            >
              {drawerOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
            <Link to="/" className="nav-logo" aria-label="CatSense AI Home">
              <CatLogo size={32} color="#000000" />
              <div className="logo-text">
                Cat<span>Sense</span> AI
              </div>
            </Link>
          </div>

          {/* Right: Links & Actions */}
          <div className="nav-right">
            {!user && (
              <div className="hidden md:flex items-center gap-3 mr-4">
                <button 
                  className="btn-nav-rect" 
                  onClick={() => scrollTo("features")}
                >
                  Features
                </button>
                <button 
                  className="btn-nav-rect" 
                  onClick={() => scrollTo("demo")}
                >
                  Live Demo
                </button>
                <button 
                  className="btn-nav-rect" 
                  onClick={() => scrollTo("disease")}
                >
                  AI Model
                </button>
                <button 
                  className="btn-nav-rect" 
                  onClick={() => scrollTo("team")}
                >
                  Our Team
                </button>
              </div>
            )}
            
            {user ? (
              <>
                <Link to="/history" className="nav-link">History</Link>
                <button onClick={handleSignOut} className="btn-outline">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Sign In</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div className="drawer-header">
           <Link to="/" className="nav-logo" onClick={() => setDrawerOpen(false)}>
              <CatLogo size={28} color="#000000" />
              <div className="logo-text">Cat<span>Sense</span> AI</div>
           </Link>
           <button className="close-drawer" onClick={() => setDrawerOpen(false)}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>
        
        <div className="drawer-links">
          <Link to="/" onClick={() => setDrawerOpen(false)} className="drawer-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>
          
          {user && (
            <Link to="/history" onClick={() => setDrawerOpen(false)} className="drawer-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
              History
            </Link>
          )}
          
          <button onClick={() => scrollTo("features")} className="drawer-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            Features
          </button>
          <button onClick={() => scrollTo("demo")} className="drawer-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Live Demo
          </button>
          <button onClick={() => scrollTo("disease")} className="drawer-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3"/><path d="M12 3v18"/></svg>
            AI Model
          </button>
          <button onClick={() => scrollTo("team")} className="drawer-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Our Team
          </button>
        </div>

        <div className="drawer-footer">
          {user ? (
            <button onClick={handleSignOut} className="btn-primary w-full">Log Out</button>
          ) : (
            <>
              <Link to="/login" className="btn-outline w-full" onClick={() => setDrawerOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-primary w-full" onClick={() => setDrawerOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>

      {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
    </>
  );
}

export default Navbar;