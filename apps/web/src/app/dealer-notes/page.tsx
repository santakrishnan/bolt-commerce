"use client";

import { DealerNotesSection } from "../../components/features/vdp/dealer-notes-section";

export default function DealerNotesPage() {
  return (
    <div>
      <main className="min-h-screen bg-background">
        <DealerNotesSection
          onReviewsClick={() => {
            console.log("Reviews clicked");
          }}
          onTestDriveClick={() => {
            console.log("Test drive clicked");
          }}
        />
      </main>
    </div>
  );
}
