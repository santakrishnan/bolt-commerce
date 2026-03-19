import Image from "next/image";
import { ActionCard } from "~/components/shared/action-card";
import { AppButton } from "~/components/shared/button";

interface TradeInCardProps {
  buttonText?: string;
  description?: string;
  detailed?: boolean;
  title?: string;
}

export const TradeInCard = ({
  buttonText = "Accept My Trade-In Offer",
  detailed = false,
  title = "What's Your Trade-In Value?",
  description = "Get a free estimate in minutes and apply it toward your next vehicle.",
}: TradeInCardProps) => {
  if (detailed) {
    return (
      <ActionCard
        buttonClassName="w-full rounded-full"
        buttonSize="md"
        buttonText={buttonText}
        buttonVariant="secondary"
        description={description}
        icon={
          <Image
            alt="Arrow inspected icon"
            className="h-(--size-avatar-sm) w-(--size-avatar-sm)"
            height={32}
            src="/images/vdp/Trade.svg"
            width={32}
          />
        }
        title={title}
      />
    );
  }

  return (
    <AppButton className="w-full rounded-full" size="md" variant="secondary">
      {buttonText}
    </AppButton>
  );
};
