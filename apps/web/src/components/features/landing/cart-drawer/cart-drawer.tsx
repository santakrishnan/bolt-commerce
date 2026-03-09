"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@tfs-ucmp/ui";
import { useState } from "react";
import { useCart } from "~/components/providers/cart-provider";

/**
 * CartDrawer - Client Component
 * Displays shopping cart in a drawer/dialog
 */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { state, actions } = useCart();

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
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
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <span className="ml-2">Cart ({state.items.length})</span>
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogDescription>
              {state.items.length === 0
                ? "Your cart is empty"
                : `${state.items.length} item(s) in your cart`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {state.items.map((item) => (
              <div className="flex items-center justify-between" key={item.id}>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                </div>
                <Button onClick={() => actions.removeFromCart(item.id)} size="sm" variant="ghost">
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <div className="flex w-full items-center justify-between">
              <p className="font-semibold">Total: ${state.total.toFixed(2)}</p>
              <Button onClick={() => setOpen(false)}>Checkout</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
