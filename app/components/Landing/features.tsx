import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, ShieldCheck } from "lucide-react";

export function Features() {
  const items = [
    {
      icon: FileText,
      title: "Ask natural questions",
      desc: "Query any PDF—reports, research, manuals—using everyday language.",
    },
    {
      icon: Bot,
      title: "Citations you can trust",
      desc: "Every answer includes line-level references so you can verify quickly.",
    },
    {
      icon: ShieldCheck,
      title: "Private and secure",
      desc: "Your documents are processed securely and never used to train models.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">
          Everything you need to understand PDFs
        </h2>
        <p className="mt-3 text-muted-foreground">
          Turn dense documents into clear answers. Works great for research,
          legal, finance, and more.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="h-full">
            <CardHeader>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10">
                <it.icon className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <CardTitle className="mt-2 text-lg">{it.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {it.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
