"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Chat with PDF home"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            C
          </span>
          <span className="font-semibold">Chat with PDF</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            FAQ
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="#try">Try it free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
