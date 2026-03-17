import { getVehicleTypes } from "~/lib/data";
import { VehicleTypeSelector } from "./vehicle-type-selector";

export interface VehicleTypeSelectorWrapperProps {
  className?: string;
  defaultSelected?: string;
  onSelect?: (vehicleId: string) => void;
}

export async function VehicleTypeSelectorWrapper(props: VehicleTypeSelectorWrapperProps) {
  const vehicleTypes = await getVehicleTypes();

  if (!vehicleTypes || vehicleTypes.length === 0) {
    return null;
  }

  return <VehicleTypeSelector vehicleTypes={vehicleTypes} {...props} />;
}
