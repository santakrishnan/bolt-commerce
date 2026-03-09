"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "~/components/providers/favorites-provider";
import type { Vehicle } from "~/lib/search/mock-vehicles";
import { mockVehicles } from "~/lib/search/mock-vehicles";

export default function FavoritesPage() {
  const { savedVins, removeVehicle, clearAll } = useFavorites();

  // Look up full vehicle data for each saved VIN
  const vehicles: Vehicle[] = savedVins
    .map((vin) => mockVehicles.find((v) => v.vin === vin))
    .filter((v): v is Vehicle => v !== undefined);

  return (
    <div className="mx-auto min-h-screen max-w-(--container-2xl) px-4 py-10 sm:px-6 lg:px-20">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">My Favorites ({vehicles.length})</h1>
        {vehicles.length > 0 && (
          <button
            className="rounded-md border border-red-500 px-4 py-2 text-red-600 text-sm transition-colors hover:bg-red-50"
            onClick={clearAll}
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-gray-500 text-lg">You haven&apos;t saved any vehicles yet.</p>
          <Link
            className="rounded-full bg-[#EB0A1E] px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-red-700"
            href="/used-cars"
          >
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Vehicle
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  VIN
                </th>
                <th className="px-4 py-3 text-right font-semibold" scope="col">
                  Price
                </th>
                <th className="px-4 py-3 text-right font-semibold" scope="col">
                  Mileage
                </th>
                <th className="px-4 py-3 text-right font-semibold" scope="col">
                  Year
                </th>
                <th className="px-4 py-3 text-center font-semibold" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((car) => {
                const imageUrl = Array.isArray(car.image) ? (car.image[0] ?? "") : car.image;
                const vdpUrl =
                  car.make && car.model && car.variant && car.year && car.vin
                    ? `/used-cars/details/${car.make}/${car.model}/${car.variant}/${car.year}/${car.vin}`
                    : "#";

                return (
                  <tr
                    className="border-b transition-colors last:border-0 hover:bg-gray-50"
                    key={car.vin}
                  >
                    <td className="px-4 py-3">
                      <Link className="flex items-center gap-3 hover:underline" href={vdpUrl}>
                        <Image
                          alt={car.title}
                          className="h-12 w-20 rounded object-contain"
                          height={48}
                          src={imageUrl}
                          width={80}
                        />
                        <span className="font-medium">{car.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{car.vin}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${car.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">{car.odometer}</td>
                    <td className="px-4 py-3 text-right">{car.year}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        aria-label={`Remove ${car.title} from favorites`}
                        className="rounded-md px-3 py-1 text-red-600 text-xs transition-colors hover:bg-red-50"
                        onClick={() => removeVehicle(car.vin)}
                        type="button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
