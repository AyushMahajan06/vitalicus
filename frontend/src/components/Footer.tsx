export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner row">
        <div>© 2025 Patient Desk Buddy</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Security</a>
          <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Docs</a>
          <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Contact</a>
        </div>
      </div>
    </footer>
  );
}
