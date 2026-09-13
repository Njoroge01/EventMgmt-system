"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  FileUp,
  LoaderCircle,
  Smartphone,
  Upload,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PaymentPage() {
  const [registrationId, setRegistrationId] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      setPaymentProof(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload a JPG, PNG, WEBP or PDF file."
      );
      e.target.value = "";
      setPaymentProof(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The payment proof must be 5 MB or smaller.");
      e.target.value = "";
      setPaymentProof(null);
      return;
    }

    setError("");
    setPaymentProof(file);
  }

  async function submitPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!registrationId.trim()) {
      setError("Please enter your registration ID.");
      return;
    }

    if (!paymentReference.trim()) {
      setError("Please enter your M-Pesa transaction reference.");
      return;
    }

    if (!paymentProof) {
      setError("Please upload your payment proof.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append(
        "payment_reference",
        paymentReference.trim()
      );

      formData.append("payment_proof", paymentProof);

      const response = await fetch(
        `${API}/participants/${registrationId.trim()}/submit-payment`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit payment proof."
        );
      }

      setSuccess(true);
      setRegistrationId("");
      setPaymentReference("");
      setPaymentProof(null);

      const fileInput = document.getElementById(
        "payment-proof"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting payment proof."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="page">
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">PAYMENT</span>
            <h1>Payment Submitted</h1>
            <p>
              Your payment details have been received and are
              awaiting verification.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <div className="success-card">
              <div className="success-icon">
                <CheckCircle size={34} />
              </div>

              <h2>Payment proof received</h2>

              <p>
                Thank you. We have received your M-Pesa
                transaction reference and payment proof.
              </p>

              <p>
                The conference team will verify the payment
                against the official payment records.
              </p>

              <div className="inline-actions">
                <Link
                  className="button button-primary"
                  href="/registration"
                >
                  Register another participant
                  <ArrowRight size={17} />
                </Link>

                <Link
                  className="button button-outline"
                  href="/"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">PAYMENT</span>

          <h1>Complete Your Payment</h1>

          <p>
            Make your payment using the official conference
            payment details, then submit your transaction
            reference and proof of payment.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container payment-grid">

          {/* M-PESA */}
          <div className="payment-card">
            <Smartphone />

            <h2>M-Pesa</h2>

            <p>
              Make your conference payment using the BIBA Kenya
              Till Number.
            </p>

            <div className="till-box">
              <span>Till Number</span>
              <strong>901585</strong>
            </div>

            <p className="payment-note">
              After making payment, keep the M-Pesa
              confirmation message. You will need the
              transaction reference when submitting your
              payment proof below.
            </p>
          </div>

          {/* BANK */}
          <div className="payment-card">
            <CreditCard />

            <h2>Bank Payment</h2>

            <p>
              Bank payment details will be displayed here once
              they are officially confirmed by the conference
              organizers.
            </p>

            <span className="payment-placeholder">
              Bank details pending confirmation
            </span>
          </div>

        </div>
      </section>

      {/* PAYMENT PROOF FORM */}
      <section className="section section-soft">
        <div className="container narrow">

          <div className="section-heading">
            <div>
              <span className="section-label">
                PAYMENT VERIFICATION
              </span>

              <h2>Submit payment proof</h2>

              <p className="prose">
                Enter the registration ID issued after your
                conference registration, your M-Pesa
                transaction reference and upload your proof of
                payment.
              </p>
            </div>
          </div>

          <form
            className="form-card"
            onSubmit={submitPayment}
          >

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-section">

              <h3>Registration details</h3>

              <div className="form-grid">

                <label className="full">
                  Registration ID

                  <input
                    type="number"
                    value={registrationId}
                    onChange={(e) =>
                      setRegistrationId(e.target.value)
                    }
                    placeholder="e.g. 25"
                    required
                  />

                  <span className="field-help">
                    Enter the registration ID you received
                    after completing registration.
                  </span>
                </label>

                <label className="full">
                  M-Pesa Transaction Reference

                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) =>
                      setPaymentReference(e.target.value)
                    }
                    placeholder="e.g. TJD7H8K9L2"
                    required
                  />

                  <span className="field-help">
                    Enter the transaction code exactly as it
                    appears in your M-Pesa confirmation message.
                  </span>
                </label>

              </div>
            </div>

            <div className="form-section">

              <h3>Upload payment proof</h3>

              <label
                className="upload-box"
                htmlFor="payment-proof"
              >
                <Upload size={30} />

                <strong>
                  {paymentProof
                    ? paymentProof.name
                    : "Upload your payment proof"}
                </strong>

                <span>
                  JPG, PNG, WEBP or PDF • Maximum 5 MB
                </span>

                <input
                  id="payment-proof"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileChange}
                  required
                />
              </label>

              {paymentProof && (
                <div className="selected-file">
                  <FileUp size={18} />

                  <div>
                    <strong>
                      {paymentProof.name}
                    </strong>

                    <span>
                      {(
                        paymentProof.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>
                </div>
              )}

            </div>

            <div className="payment-reminder">
              <strong>Before submitting</strong>

              <ul>
                <li>
                  Confirm that you paid to Till Number{" "}
                  <strong>901585</strong>.
                </li>

                <li>
                  Make sure the transaction reference is
                  correct.
                </li>

                <li>
                  Make sure the uploaded proof clearly shows
                  the payment details.
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="button button-primary form-submit"
              disabled={submitting}
            >
              {submitting ? (
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

            <p className="form-note">
              Your payment will remain pending until the
              conference team verifies it against the official
              payment records.
            </p>

          </form>

        </div>
      </section>
    </div>
  );
}