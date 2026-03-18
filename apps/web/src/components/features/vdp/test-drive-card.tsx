"use client";

import { AppButton } from "~/components/shared/button";

interface TestDriveCardProps {
  buttonText?: string;
}

export const TestDriveCard = ({ buttonText = "Book an Appointment" }: TestDriveCardProps) => {
  return (
    <AppButton className="w-full rounded-full" size="md" variant="tertiary">
      {buttonText}
    </AppButton>
  );
};
