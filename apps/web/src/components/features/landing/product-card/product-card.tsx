import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tfs-ucmp/ui";
import { ProductCardActions } from "./product-card-actions";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard - Server Component
 * Displays product information
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex min-h-[400px] flex-col">
      <CardHeader>
        <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
          {/* Placeholder for product image */}
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <svg
              aria-hidden="true"
              className="h-16 w-16"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">{product.name}</CardTitle>
        <CardDescription className="font-semibold text-foreground text-lg">
          ${product.price}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <ProductCardActions productId={product.id} />
      </CardFooter>
    </Card>
  );
}
