"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadPaymentProofAction } from "@/features/checkout/actions/upload-payment-proof";

type Props = {
  orderId: string;
  email: string;
  alreadyUploadedAt: Date | null;
};

export function PaymentProofUpload({ orderId, email, alreadyUploadedAt }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showReplace, setShowReplace] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadPaymentProofAction(orderId, email, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setShowReplace(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Re-fetch server data so the page reflects the new upload —
      // uploading proof never changes payment status on its own, so
      // this only updates the "proof uploaded" state, not the status
      // badge.
      router.refresh();
    });
  }

  const alreadyUploaded = alreadyUploadedAt && !showReplace;

  return (
    <div className="mt-4 border-t border-[var(--brand-line)] pt-4">
      {alreadyUploaded ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-sm text-[var(--brand-steel)]">
            Payment proof uploaded on{" "}
            {alreadyUploadedAt.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            . This does not change your order status — we&apos;ll verify your transfer and
            update it separately.
          </p>
          <button
            type="button"
            onClick={() => setShowReplace(true)}
            className="text-body-sm shrink-0 font-medium text-[var(--brand-ink)] underline underline-offset-2 hover:opacity-80"
          >
            Upload a replacement
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label
            htmlFor="payment-proof-file"
            className="text-body-sm block font-medium text-[var(--brand-ink)]"
          >
            Upload payment proof (optional)
          </label>
          <p className="text-caption text-[var(--brand-steel)]">
            JPEG, PNG, or WebP, up to 5MB. This is for our records only — it does not
            change your order status.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="payment-proof-file"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-body-sm w-full max-w-xs text-[var(--brand-ink)] file:mr-3 file:h-9 file:rounded-[0.375rem] file:border-0 file:bg-[var(--brand-ink)] file:px-4 file:text-body-sm file:font-medium file:text-white sm:w-auto"
            />
            <button
              type="submit"
              disabled={isPending}
              className="text-body-sm flex h-9 shrink-0 items-center justify-center rounded-[0.5rem] border border-[var(--brand-line)] px-4 font-medium text-[var(--brand-ink)] transition-colors hover:bg-[var(--brand-frost-dim)] disabled:opacity-60"
            >
              {isPending ? "Uploading…" : "Upload"}
            </button>
            {showReplace && (
              <button
                type="button"
                onClick={() => setShowReplace(false)}
                className="text-body-sm shrink-0 text-[var(--brand-steel)] underline underline-offset-2 hover:opacity-80"
              >
                Cancel
              </button>
            )}
          </div>
          {error && (
            <p className="text-caption rounded-[0.375rem] bg-red-50 px-3 py-2 text-red-600">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
