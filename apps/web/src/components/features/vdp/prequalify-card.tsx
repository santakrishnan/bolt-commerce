import Image from "next/image";
import { ActionCard } from "~/components/shared/action-card";
import { AppButton } from "~/components/shared/button";

interface PrequalifyCardProps {
  buttonText?: string;
  description?: string;
  detailed?: boolean;
  title?: string;
}

export const PrequalifyCard = ({
  buttonText = "Get started",
  detailed = false,
  title = "Know Your Buying Power",
  description = "Get pre-qualified without any impact to your credit",
}: PrequalifyCardProps) => {
  if (detailed) {
    return (
      <ActionCard
        buttonClassName="w-full rounded-full"
        buttonSize="md"
        buttonText={buttonText}
        buttonVariant="primary"
        description={description}
        icon={
          <Image
            alt="Arrow inspected icon"
            className="h-(--size-avatar-sm) w-(--size-avatar-sm)"
            height={32}
            src="/images/vdp/Inspected-red.svg"
            width={32}
          />
        }
        title={title}
      />
    );
  }

  return (
    <AppButton className="w-full rounded-full" size="md" variant="primary">
      {buttonText}
    </AppButton>
  );
};
