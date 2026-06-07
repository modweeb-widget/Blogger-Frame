export default function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <div className="footer-info">
          <span>&copy; 2026 جميع الحقوق محفوظة.</span>
          <span className="separator"></span>
          <span>
            صنع بـ 🤍 بواسطة{" "}
            <a href="https://github.com/modweeb" target="_blank" rel="noopener">
              مود ويب
            </a>
            !
          </span>
        </div>
        <ul className="footer-links">
          <li>
            <a
              href="https://github.com/modweeb"
              target="_blank"
              rel="noopener"
              aria-label="Github"
            >
              <svg viewBox="0 0 24 24">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </li>
          <li>
            <a href="mailto:modweeb3@gmail.com" aria-label="Email">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
