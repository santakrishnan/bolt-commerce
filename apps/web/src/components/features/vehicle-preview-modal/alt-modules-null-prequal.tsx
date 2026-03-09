"use client";
import Image from "next/image";
import { Button } from "../../../../../../packages/ui/src/components/button";

const AltModulesNullPrequel = () => {
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
            <p className="font-semibold text-[#272727] text-sm leading-[130%] tracking-[-0.42px]">
              Know Your Buying Power
            </p>
            <p className="font-normal text-[#58595B] text-xs leading-normal">
              Get pre-qualified without any impact to your credit
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 lg:block lg:pb-0">
          <Button className="flex h-10 w-full items-center justify-center gap-2.5 rounded-full bg-[#EB0A1E] px-8 py-2.5 text-white hover:bg-red-700">
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
            <p className="font-semibold text-[#272727] text-sm leading-[130%] tracking-[-0.42px]">
              What's Your Trade-In Value?
            </p>
            <p className="font-normal text-[#58595B] text-xs leading-normal">
              Get a free estimate in minutes and apply it toward your next vehicle.
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 lg:block lg:pb-0">
          <Button className="flex h-10 w-full items-center justify-center gap-2.5 rounded-full bg-[#000000] px-8 py-2.5 text-white hover:bg-red-700">
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
            <p className="font-semibold text-[#272727] text-sm leading-[130%] tracking-[-0.42px]">
              Schedule a Test drive today.
            </p>
            <div className="flex w-full items-center justify-between">
              <p className="flex font-normal text-[#58595B] text-xs leading-normal">
                See It In Person. Schedule a test drive at Toyota of Fort Worth.
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
          <Button className="flex h-10 w-full items-center justify-center gap-2.5 rounded-full border border-black bg-[#ffffff] px-8 py-2.5 text-black hover:bg-gray-700">
            Book an Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AltModulesNullPrequel;
