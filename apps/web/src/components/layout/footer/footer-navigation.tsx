"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@tfs-ucmp/ui";
import Link from "next/link";
import { footerSections } from "~/lib/data/footer/footer-links";

/**
 * FooterNavigation - Navigation links with accordion for mobile
 * Client Component for accordion interactivity
 */
export function FooterNavigation() {
  // Only render nav columns for desktop grid (md and up)
  return (
    <>
      {footerSections.map((section) => (
        <div className="hidden min-w-0 md:block" key={section.title}>
          <h3 className="mb-4 font-bold font-toyota text-[var(--core-surfaces-inverse-foreground)] text-xl leading-6">
            {section.title}
          </h3>
          <ul className="space-y-3">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link
                  className="font-normal font-toyota text-[var(--states-inverse-muted-foreground)] text-sm leading-4 transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
                  href={link.href}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {/* Mobile Accordion Layout (below md) */}
      <div className="md:hidden">
        <Accordion className="w-full" type="multiple">
          {footerSections.map((section, index) => (
            <AccordionItem
              className="border-[var(--structure-interaction-inverse-border)] border-b last:border-b-0"
              key={section.title}
              value={`section-${index}`}
            >
              <AccordionTrigger className="accordion-trigger flex h-[72px] items-center justify-between text-left font-bold font-toyota text-[16px] text-[var(--core-surfaces-inverse-foreground)] leading-[100%] tracking-[0] hover:no-underline [&>svg]:text-[var(--core-surfaces-inverse-foreground)] [&[data-state=open]>svg]:rotate-180">
                <span>{section.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        className="font-normal font-toyota text-[var(--states-inverse-muted-foreground)] text-sm leading-4 transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
                        href={link.href}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        target={link.external ? "_blank" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
