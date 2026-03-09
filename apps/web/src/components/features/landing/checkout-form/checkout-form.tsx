"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@tfs-ucmp/ui";
import { useState } from "react";

/**
 * CheckoutForm - Client Component
 * Handles checkout process
 */
export function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    //alert("Order placed successfully!");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Enter your payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="name">
              Cardholder Name
            </label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="card">
              Card Number
            </label>
            <Input id="card" placeholder="1234 5678 9012 3456" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="expiry">
                Expiry Date
              </label>
              <Input id="expiry" placeholder="MM/YY" required />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="cvc">
                CVC
              </label>
              <Input id="cvc" placeholder="123" required />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isProcessing} type="submit">
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
