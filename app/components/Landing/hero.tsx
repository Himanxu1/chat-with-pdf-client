import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
        <div>
          <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-5xl">
            Chat with your PDFs instantly
          </h1>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Upload a PDF and ask questions in plain language. Get answers with
            citations, summaries, and key insights—fast, accurate, and secure.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3" id="try">
            <Button>Try it free</Button>
            <Button
              variant="outline"
              className="border-accent text-foreground hover:bg-accent/10 bg-transparent"
            >
              View pricing
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free plan includes 3 PDF chats. No credit card required.
          </p>
        </div>
        <div className="relative">
          <img
            src="/chat-with-pdf-conversation-ui.png"
            alt="Preview of Chat with PDF conversation UI"
            className="w-full rounded-lg border bg-card"
          />
        </div>
      </div>
    </section>
  );
}
