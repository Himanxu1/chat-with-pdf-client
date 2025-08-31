import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-semibold md:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is my data private?</AccordionTrigger>
            <AccordionContent>
              Yes. Your documents are processed securely and are not used to
              train models.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What file sizes are supported?</AccordionTrigger>
            <AccordionContent>
              Free supports up to 10MB. Pro supports up to 50MB. Larger limits
              available on request.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do answers include citations?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Answers include quotes and page references so you can
              verify quickly.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
