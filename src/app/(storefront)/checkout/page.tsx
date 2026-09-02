"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { formatCentsAsUsd } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  US_STATES,
  checkoutSchema,
  type CheckoutFieldErrors,
} from "@/features/checkout/schemas/checkout.schema";
import { placeOrderAction } from "@/features/checkout/actions/place-order";

const inputClass =
  "h-11 w-full rounded-[0.375rem] border border-[var(--brand-line)] bg-white px-3 text-body-sm text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-ink)]";
const labelClass = "text-body-sm mb-1.5 block font-medium text-[var(--brand-ink)]";
const errorClass = "text-caption mt-1 text-red-600";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, isHydrated, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "manual_payment_request" | "">("");
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isHydrated) {
    return <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="text-h2 text-[var(--brand-ink)]">Your cart is empty</h1>
        <p className="text-body-sm mt-3 text-[var(--brand-steel)]">
          Add a system to your cart before checking out.
        </p>
        <Link
          href="/cold-plunge-tubs"
          className="text-body-sm mt-8 inline-flex h-12 items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] px-8 font-medium text-white transition-colors hover:opacity-90"
        >
          Shop Cold Plunges
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const result = checkoutSchema.safeParse({
      customer: { firstName, lastName, email, phone },
      shipping: { address, apartment, city, state, postalCode, country: "US" },
      paymentMethod: paymentMethod || undefined,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });

    if (!result.success) {
      const fieldErrors: CheckoutFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[issue.path.length - 1];
        if (typeof key === "string") {
          fieldErrors[key as keyof CheckoutFieldErrors] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const actionResult = await placeOrderAction(result.data);

      if (!actionResult.success) {
        setSubmitError(actionResult.error);
        return;
      }

      // Clear the cart client-side, then navigate — the order already
      // exists in the database at this point regardless of navigation.
      clearCart();
      router.push(`/order/${actionResult.orderId}`);
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Checkout" }]} />
      <h1 className="text-h1 mb-10 mt-4 text-[var(--brand-ink)]">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 pb-24 lg:grid-cols-3 lg:gap-16">
        <div className="space-y-10 lg:col-span-2">
          {/* Customer information */}
          <section>
            <h2 className="text-h3 mb-4 text-[var(--brand-ink)]">Customer Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>First name</label>
                <input
                  id="firstName"
                  className={inputClass}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Last name</label>
                <input
                  id="lastName"
                  className={inputClass}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
                {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input
                  id="phone"
                  type="tel"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="text-h3 mb-4 text-[var(--brand-ink)]">Shipping Address</h2>
            <div className="grid gap-4">
              <div>
                <label htmlFor="address" className={labelClass}>Address</label>
                <input
                  id="address"
                  className={inputClass}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="address-line1"
                />
                {errors.address && <p className={errorClass}>{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="apartment" className={labelClass}>
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  id="apartment"
                  className={inputClass}
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  autoComplete="address-line2"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input
                    id="city"
                    className={inputClass}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                  />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>State</label>
                  <select
                    id="state"
                    className={inputClass}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    autoComplete="address-level1"
                  >
                    <option value="">Select</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="postalCode" className={labelClass}>ZIP code</label>
                  <input
                    id="postalCode"
                    className={inputClass}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    autoComplete="postal-code"
                  />
                  {errors.postalCode && <p className={errorClass}>{errors.postalCode}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input className={inputClass} value="United States" disabled />
              </div>
            </div>
          </section>

          {/* Payment method — exactly the two locked options */}
          <section>
            <h2 className="text-h3 mb-4 text-[var(--brand-ink)]">Payment Method</h2>
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[0.5rem] border p-4 transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-[var(--brand-ink)] bg-[var(--brand-frost-dim)]"
                    : "border-[var(--brand-line)]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1"
                />
                <div>
                  <p className="text-body-sm font-medium text-[var(--brand-ink)]">
                    Bank Transfer
                  </p>
                  <p className="text-body-sm mt-1 text-[var(--brand-steel)]">
                    Transfer the exact order amount to our bank account. You&apos;ll receive
                    the account details and a payment reference after placing your order, and
                    can upload a payment screenshot for our records.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[0.5rem] border p-4 transition-colors ${
                  paymentMethod === "manual_payment_request"
                    ? "border-[var(--brand-ink)] bg-[var(--brand-frost-dim)]"
                    : "border-[var(--brand-line)]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="manual_payment_request"
                  checked={paymentMethod === "manual_payment_request"}
                  onChange={() => setPaymentMethod("manual_payment_request")}
                  className="mt-1"
                />
                <div>
                  <p className="text-body-sm font-medium text-[var(--brand-ink)]">
                    Manual Payment Request
                  </p>
                  <p className="text-body-sm mt-1 text-[var(--brand-steel)]">
                    We&apos;ll send a secure payment request to your email after your order is
                    submitted.
                  </p>
                </div>
              </label>
              {errors.paymentMethod && <p className={errorClass}>{errors.paymentMethod}</p>}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div>
          <div className="sticky top-24 rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
            <h2 className="text-h3 mb-6 text-[var(--brand-ink)]">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-3">
                  <div className="text-body-sm text-[var(--brand-ink)]">
                    {item.name}
                    <span className="text-[var(--brand-steel)]"> × {item.quantity}</span>
                  </div>
                  <div className="text-body-sm shrink-0 text-[var(--brand-ink)]">
                    {formatCentsAsUsd(item.priceCents * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-[var(--brand-line)] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-[var(--brand-steel)]">Subtotal</span>
                <span className="text-body-sm text-[var(--brand-ink)]">
                  {formatCentsAsUsd(subtotalCents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-[var(--brand-steel)]">Shipping</span>
                <span className="text-body-sm text-[var(--brand-steel)]">
                  Calculated separately
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--brand-line)] pt-4">
              <span className="text-body font-medium text-[var(--brand-ink)]">Total</span>
              <span className="text-h3 text-[var(--brand-ink)]">
                {formatCentsAsUsd(subtotalCents)}
              </span>
            </div>

            {submitError && (
              <p className="text-caption mt-4 rounded-[0.375rem] bg-red-50 px-3 py-2 text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="text-body-sm mt-4 flex h-12 w-full items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Placing Order…" : "Place Order"}
            </button>
            <p className="text-caption mt-3 text-center text-[var(--brand-steel)]">
              The final price is confirmed by our server before your order is created.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
