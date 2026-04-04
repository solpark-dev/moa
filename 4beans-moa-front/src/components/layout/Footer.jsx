import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-0">
          <p className="text-xs text-muted-foreground">
            © 2026 MOA. All rights reserved.
          </p>
          <ul className="flex gap-4 text-xs text-muted-foreground">
            <li>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                이용약관
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                개인정보처리방침
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
