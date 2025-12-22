import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "@/components/ui";
import cartService from "@/services/cartService";
import type { CartItem } from "@/types";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(cartService.getCart());

  useEffect(() => {
    const unsub = cartService.subscribe(() => setItems(cartService.getCart()));
    return unsub;
  }, []);

  function subtotal() {
    return items.reduce(
      (s, i) => s + (i.course.price || 0) * (i.quantity || 0),
      0
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-12">
        <Card className="max-w-4xl mx-auto p-6 text-center">
          Your cart is empty
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-lg md:text-2xl font-semibold">Your Cart</h2>
        <Card className="p-4">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.courseId} className="flex items-center gap-4">
                <img
                  src={it.course.thumbnail}
                  alt={it.course.title}
                  className="w-28 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{it.course.title}</div>
                  <div className="text-xs text-neutral-500">
                    {it.course.instructor.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={it.quantity}
                    onChange={(e) =>
                      cartService.updateQuantity(
                        it.courseId,
                        Number(e.target.value) || 0
                      )
                    }
                    className="w-20"
                  />
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {(
                      (it.course.price || 0) *
                      (it.quantity || 0) *
                      23000
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </div>
                  <div className="text-xs text-neutral-500">
                    {it.course.price} USD
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => cartService.removeFromCart(it.courseId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-lg md:text-xl font-semibold">Subtotal</div>
              <div className="text-lg md:text-xl font-semibold">
                {(subtotal() * 23000).toLocaleString("vi-VN")} ₫
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => navigate("/courses")}>
                Continue shopping
              </Button>
              <Button onClick={() => navigate("/purchases")}>Checkout</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
