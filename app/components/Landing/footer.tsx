import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Chat with PDF
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-muted-foreground hover:text-foreground"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
