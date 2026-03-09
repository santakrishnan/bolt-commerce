import { Card } from "@tfs-ucmp/ui";
import Image from "next/image";

interface InspectionCardProps {
  /** Photo displayed at top of card */
  photoSrc: string;
  photoAlt: string;
  /** Small icon next to the title */
  iconSrc: string;
  /** Card title — supports line breaks via \n or JSX */
  title: React.ReactNode;
  description: string;
}

/**
 * InspectionCard - Reusable card for the "Inspected" certification section.
 * Displays a photo, icon, title, and description.
 */
export function InspectionCard({
  photoSrc,
  photoAlt,
  iconSrc,
  title,
  description,
}: InspectionCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          alt={photoAlt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          src={photoSrc}
        />
      </div>
      <div className="flex flex-col items-start p-6">
        <div className="mb-3 flex items-center gap-3">
          <Image
            alt=""
            aria-hidden="true"
            className="h-8 w-8"
            height={32}
            src={iconSrc}
            width={32}
          />
          <h4 className="font-semibold text-base text-gray-900">{title}</h4>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
