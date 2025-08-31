const steps = [
  {
    step: "1",
    title: "Upload PDF",
    desc: "Drag-and-drop or select a file from your device.",
  },
  {
    step: "2",
    title: "Ask anything",
    desc: "Use plain English to ask questions about the document.",
  },
  {
    step: "3",
    title: "Get cited answers",
    desc: "Receive accurate answers with page references and quotes.",
  },
];

export function Steps() {
  return (
    <section className="border-y bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-semibold md:text-3xl">
            How it works
          </h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="rounded-lg border p-6">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {s.step}
              </div>
              <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
