# Vehicle Type Selector

A responsive, accessible vehicle type selection component with hover effects and selection state.

## Features

- ✅ Responsive grid layout (2 columns mobile, 4 columns desktop)
- ✅ Hover effects with custom background color (#F8F8F8)
- ✅ Selection state management
- ✅ Accessible markup with ARIA labels
- ✅ Uses CSS variables from global.css
- ✅ Built with shadcn/ui patterns
- ✅ CVA for variant styling
- ✅ React 19 patterns

## Architecture

### Data Layer (`lib/vehicles/vehicle-types.ts`)
Contains vehicle type definitions and data. Easily extendable for new vehicle types.

### Component Layer
- **`VehicleTypeCard`** (Client Component) - Interactive card with hover/selection states
- **`VehicleTypeSelector`** (Client Component) - Main section with grid layout and state management

## Usage

### Basic Usage

```tsx
import { VehicleTypeSelector } from 'ui';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <VehicleTypeSelector />
    </div>
  );
}
```

### With Selection Handler

```tsx
import { VehicleTypeSelector } from 'ui';

export default function Page() {
  const handleVehicleSelect = (vehicleId: string) => {
    console.log('Selected vehicle:', vehicleId);
    // Handle selection (e.g., navigate, update state, etc.)
  };

  return (
    <VehicleTypeSelector 
      onSelect={handleVehicleSelect}
      defaultSelected="sedan"
    />
  );
}
```

### Using VehicleTypeCard Directly

```tsx
import { VehicleTypeCard } from 'ui';

export default function CustomGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <VehicleTypeCard
        image="/images/vehicles/sedan.png"
        name="SEDAN"
        description="Fuel-efficient daily driver"
        onClick={() => console.log('Sedan clicked')}
      />
      <VehicleTypeCard
        image="/images/vehicles/suv.png"
        name="SUV"
        description="Space & versatility"
        selected={true}
      />
    </div>
  );
}
```

## Props

### VehicleTypeSelector

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(vehicleId: string) => void` | - | Callback when a vehicle is selected |
| `defaultSelected` | `string` | `null` | Default selected vehicle ID |
| `className` | `string` | - | Additional CSS classes |

### VehicleTypeCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | **required** | Vehicle image path |
| `name` | `string` | **required** | Vehicle type name |
| `description` | `string` | - | Vehicle description text |
| `onClick` | `() => void` | - | Click handler |
| `selected` | `boolean` | `false` | Selection state |
| `className` | `string` | - | Additional CSS classes |

## Styling

### CSS Variables Used
- `--background` - Default background
- `--foreground` - Text color
- `--border` - Border color
- `--primary` - Primary theme color (for selection)
- `--muted-foreground` - Description text color

### Hover State
Cards use a custom hover background color `#F8F8F8` as specified, with smooth transitions and scale effect on images.

## Adding New Vehicle Types

Edit `lib/vehicles/vehicle-types.ts`:

```tsx
export const vehicleTypes: VehicleType[] = [
  // ... existing vehicles
  {
    id: 'electric',
    name: 'ELECTRIC',
    description: 'Eco-friendly & efficient',
    image: '/images/vehicles/electric.png',
  },
];
```

## Images

Place vehicle images in: `public/images/vehicles/`

Required images:
- sedan.png
- suv.png
- truck.png
- coupe.png
- hatchback.png
- wagon.png
- van.png
- convertible.png
