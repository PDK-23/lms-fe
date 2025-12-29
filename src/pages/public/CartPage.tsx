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

  const formatVND = (amountUSD: number) =>
    (amountUSD * 23000).toLocaleString("vi-VN") + " ₫";

  if (!items || items.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Add courses to your cart to see them here.
            </p>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => navigate("/courses")}>
                Continue shopping
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // selected items state (checked for checkout)
  const [selected, setSelected] = useState<string[]>(
    items.map((it) => it.courseId)
  );
  const [coupon, setCoupon] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Keep selected in sync when items change (remove deselected items)
  useEffect(() => {
    setSelected((prev) =>
      prev.filter((id) => items.some((i) => i.courseId === id))
    );
  }, [items]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(items.map((i) => i.courseId));
  const clearSelection = () => setSelected([]);

  const selectedSubtotal = items
    .filter((i) => selected.includes(i.courseId))
    .reduce((s, i) => s + (i.course.price || 0) * (i.quantity || 0), 0);

  const applyCoupon = () => {
    // simple coupon logic for demo
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === "SAVE10") {
      setAppliedCoupon({ code, amount: Math.round(selectedSubtotal * 0.1) });
      setCouponError(null);
    } else if (code === "TAKE50") {
      setAppliedCoupon({ code, amount: 50 });
      setCouponError(null);
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const discount = appliedCoupon ? appliedCoupon.amount : 0;
  const totalAfterDiscount = Math.max(0, selectedSubtotal - discount);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 col-span-1">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">Your Cart</h2>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.length === items.length}
                  onChange={(e) =>
                    e.target.checked ? selectAll() : clearSelection()
                  }
                />
                <div className="text-sm">Select all</div>
              </div>
              <div className="text-sm text-neutral-600">
                {items.length} item(s)
              </div>
            </div>

            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.courseId}
                  className="grid grid-cols-12 items-center gap-4 py-3 border rounded"
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(it.courseId)}
                      onChange={() => toggleSelect(it.courseId)}
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <img
                      src={it.course.thumbnail}
                      alt={it.course.title}
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-6">
                    <div className="font-medium">{it.course.title}</div>
                    <div className="text-xs text-neutral-500">
                      {it.course.instructor.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {(it.course.price || 0).toFixed(2)} USD
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="md:col-span-4 col-span-1">
          <Card className="p-6 sticky md:top-24">
            <div className="text-sm text-neutral-600 mb-3">Order Summary</div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">Selected subtotal</div>
              <div className="font-semibold">{formatVND(selectedSubtotal)}</div>
            </div>

            <div className="mb-3">
              <label className="text-sm block mb-2">Coupon code</label>
              <div className="flex gap-2">
                <Input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon"
                />
                <Button onClick={applyCoupon}>Apply</Button>
              </div>
              {couponError && (
                <div className="text-sm text-red-600 mt-2">{couponError}</div>
              )}
              {appliedCoupon && (
                <div className="mt-2 text-sm text-green-600">
                  Applied: {appliedCoupon.code} -{" "}
                  {formatVND(appliedCoupon.amount)}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <div className="text-sm">Total</div>
              <div className="text-lg font-bold">
                {formatVND(totalAfterDiscount)}
              </div>
            </div>

            <div className="mt-4">
              <Button
                className="w-full"
                onClick={() => navigate("/purchases")}
                disabled={selected.length === 0}
              >
                Checkout ({selected.length})
              </Button>
            </div>
            <div className="mt-3 text-xs text-neutral-500">
              You will be redirected to Purchases to complete payment.
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
