"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  Smartphone,
  Upload
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Registration = {
  id: number;
  amount: number;
};

export default function ExhibitionForm() {
  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [registration, setRegistration] =
    useState<Registration | null>(null);

  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // --------------------------------------------------
  // Load exhibitor fee
  // --------------------------------------------------

  useEffect(() => {
    fetch(`${API}/exhibitors/fee`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Exhibitor fee is not configured yet");
        }

        return res.json();
      })
      .then((data) => {
        setFee(Number(data.fee ?? data.value));
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load exhibitor fee"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // --------------------------------------------------
  // Register exhibitor
  // --------------------------------------------------

  async function submitRegistration(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch(`${API}/exhibitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Exhibitor registration failed"
        );
      }

      setRegistration({
        id: data.exhibitor.id,
        amount: Number(data.amount_due)
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Exhibitor registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // --------------------------------------------------
  // Submit payment proof
  // --------------------------------------------------

  async function submitPayment(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!registration) return;

    setPaymentError("");
    setPaymentSubmitting(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(
        `${API}/exhibitors/${registration.id}/submit-payment`,
        {
          method: "PATCH",
          body: form
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Payment submission failed"
        );
      }

      setPaymentSubmitted(true);
    } catch (err) {
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Payment submission failed"
      );
    } finally {
      setPaymentSubmitting(false);
    }
  }

  // --------------------------------------------------
  // Final success
  // --------------------------------------------------

  if (paymentSubmitted && registration) {
    return (
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle2 size={28} />
        </div>

        <h2>Exhibition registration complete</h2>

        <p>
          Your exhibitor registration ID is{" "}
          <strong>#{registration.id}</strong>.
        </p>

        <p>
          Your payment proof has been received and is now
          pending verification.
        </p>

        <div className="info-card">
          <strong>What happens next?</strong>
          <p>
            The conference team will verify your payment.
            You will receive confirmation once your payment
            has been approved.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Payment stage
  // --------------------------------------------------

  if (registration) {
    return (
      <div className="form-card">

        <div className="success-icon">
          <CheckCircle2 size={28} />
        </div>

        <h2>Registration received</h2>

        <p>
          Your exhibitor registration ID is{" "}
          <strong>#{registration.id}</strong>.
        </p>

        <div className="price-box">
          <span>Exhibition fee</span>
          <strong>
            KES {registration.amount.toLocaleString()}
          </strong>
        </div>

        <div className="form-section">
          <h3>Make your payment</h3>

          <div className="payment-method-card">
            <Smartphone size={22} />

            <div>
              <strong>M-Pesa Buy Goods / Till Number</strong>

              <p>
                Use the official BIBA Kenya Till Number to
                make your payment.
              </p>

              <div className="till-number">
                901585
              </div>
            </div>
          </div>

          <div className="payment-method-card">
            <CreditCard size={22} />

            <div>
              <strong>Bank payment</strong>

              <p>
                Bank payment details will be provided by
                the conference organizers.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitPayment}
          className="form-section"
        >
          <h3>Submit payment proof</h3>

          {paymentError && (
            <div className="form-error">
              {paymentError}
            </div>
          )}

          <label>
            M-Pesa / Bank payment reference
            <input
              name="payment_reference"
              required
              placeholder="e.g. QWE123ABC"
            />
          </label>

          <label>
            Payment proof
            <div className="file-input-wrapper">
              <Upload size={18} />

              <input
                name="payment_proof"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                required
              />
            </div>

            <small>
              Accepted formats: JPG, PNG, WEBP or PDF.
              Maximum size: 5 MB.
            </small>
          </label>

          <button
            type="submit"
            className="button button-primary form-submit"
            disabled={paymentSubmitting}
          >
            {paymentSubmitting ? (
              <>
                <LoaderCircle className="spin" />
                Submitting payment...
              </>
            ) : (
              <>
                Submit payment proof
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // --------------------------------------------------
  // Registration stage
  // --------------------------------------------------

  return (
    <form
      className="form-card"
      onSubmit={submitRegistration}
    >
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-section">
        <h3>Exhibitor details</h3>

        <div className="form-grid">
          <label>
            Contact person
            <input
              name="full_name"
              required
              placeholder="Full name"
            />
          </label>

          <label>
            ID / Passport number
            <input
              name="id_passport"
              required
              placeholder="ID or passport number"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              required
              placeholder="+254..."
            />
          </label>

          <label>
            Organization / Company
            <input
              name="organization"
              required
              placeholder="Organization or individual"
            />
          </label>

          <label>
            Country
            <input
              name="country"
              required
              placeholder="Kenya"
            />
          </label>

          <label className="full">
            Address
            <input
              name="address"
              required
              placeholder="Physical / postal address"
            />
          </label>

          <label className="full">
            What will you exhibit?
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe your products, services or innovations."
            />
          </label>

          <label className="full">
            Website (optional)
            <input
              name="website_link"
              placeholder="https://..."
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Payment method</h3>

        <label>
          Choose payment method

          <select
            name="payment_method"
            required
          >
            <option value="">
              Select method
            </option>

            <option value="mpesa">
              M-Pesa
            </option>

            <option value="bank">
              Bank
            </option>
          </select>
        </label>

        {loading ? (
          <div className="loading">
            <LoaderCircle className="spin" />
            Checking exhibitor fee...
          </div>
        ) : fee !== null ? (
          <div className="price-box">
            <span>Exhibition fee</span>

            <strong>
              KES {fee.toLocaleString()}
            </strong>
          </div>
        ) : (
          <div className="warning">
            Exhibitor fee has not been configured.
          </div>
        )}
      </div>

      <button
        className="button button-primary form-submit"
        disabled={submitting || fee === null}
      >
        {submitting ? (
          <>
            <LoaderCircle className="spin" />
            Registering...
          </>
        ) : (
          <>
            Continue to payment
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </form>
  );
}