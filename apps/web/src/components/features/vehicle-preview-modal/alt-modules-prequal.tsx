"use client";
import Image from "next/image";
import { Button } from "../../../../../../packages/ui/src/components/button";

const AltModulesPrequel = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 border-gray-200 border-t py-6">
        <div className="center flex gap-4">
          <div className="flex items-center justify-center">
            <Image
              alt="Arrow inspected icon"
              className="h-8 w-8"
              height={32}
              src="/images/vdp/Inspected-red.svg"
              width={32}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-semibold text-brand-text-dealer text-sm leading-[130%] tracking-[-0.42px]">
              Get Pre-qualifed in Minutes
            </p>
            <p className="font-normal text-[#58595B] text-xs leading-normal">
              Unlock your buying power with no credit impact
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 lg:block lg:pb-0">
          <Button className="flex h-10 w-full items-center justify-center gap-2.5 rounded-full bg-actions-primary px-8 py-2.5 text-white hover:bg-red-700">
            Get started
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-gray-200 border-t py-6">
        <div className="center flex gap-4">
          <div className="flex items-center justify-center">
            <Image
              alt="Arrow inspected icon"
              className="h-8 w-8"
              height={32}
              src="/images/vdp/Trade.svg"
              width={32}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-semibold text-brand-text-dealer text-sm leading-[130%] tracking-[-0.42px]">
              What's Your Car Worth
            </p>
            <p className="font-normal text-[#58595B] text-xs leading-normal">
              Get a free estimate in minutes and apply it toward your next vehicle.
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 lg:block lg:pb-0">
          <Button className="flex h-10 w-full items-center justify-center gap-2.5 rounded-full bg-brand-text-primary px-8 py-2.5 text-white hover:bg-red-700">
            Accept My Trade-In Offer
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-gray-200 border-t py-6">
        <div className="center flex gap-4">
          <div className="flex items-center justify-center">
            <Image
              alt="Toyota logo"
              className="h-8 w-8"
              height={32}
              src="/images/vdp/Toyota-logo.svg"
              width={32}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2.5">
            <p className="font-semibold text-brand-text-dealer text-sm leading-[130%] tracking-[-0.42px]">
              Ready to Drive it ?
            </p>
            <div className="flex w-full items-center justify-between">
              <p className="flex font-normal text-[#58595B] text-xs leading-normal">
                Experience this vehicle firsthand at Toyota of Fort Worth
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <Image
                  alt="Location"
                  className="h-3 w-3"
                  height={12}
                  src="/images/garage/location.svg"
                  width={12}
                />
                <p className="font-normal text-[#58595B] text-xs leading-normal">6 mi</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white pb-5 lg:block lg:pb-0">
          <Button className="flex h-10 w-full items-center justify-center gap-2.5 rounded-full border border-black bg-primary-foreground px-8 py-2.5 text-black hover:bg-gray-700">
            Book an Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AltModulesPrequel;
