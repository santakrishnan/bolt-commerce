"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@tfs-ucmp/ui";
import Link from "next/link";
import type { FooterSection } from "~/lib/data/footer/footer-links";

export function FooterNavigationMobile({ sections }: { sections: FooterSection[] }) {
  return (
    <Accordion className="w-full" type="multiple">
      {sections.map((section, index) => (
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
  );
}
