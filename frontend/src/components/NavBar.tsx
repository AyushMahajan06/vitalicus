export default function NavBar() {
  return (
    <header className="navbar-gradient">
      <div className="container nav">
        <div className="brand">
          <span className="brand-mark" />
          <span >Vitalicus</span>
        </div>

        <nav className="menu">
          <a href="#">Overview</a>
          <a href="#">Device</a>
          <a href="#">Platform</a>
          <a href="#">Security</a>
        </nav>

        <div className="row" style={{ gap: 12 }}>
          <button className="btn ghost">Sign In</button>
          <button className="btn">Request Demo</button>
        </div>
      </div>
    </header>
  );
}
