"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";

type CategoryField = {
  key: string;
  label: string;
  type?: string;
};

type Category = {
  id: number;
  name: string;
  price: string | number;
  fields: CategoryField[];
};

type SuccessData = {
  id: number;
  amount: string | number;
};

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function RegistrationForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState<SuccessData | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/participants/categories`);

        if (!response.ok) {
          throw new Error(
            "Unable to load participant categories. Please try again later."
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid category data received from the server.");
        }

        setCategories(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load participant categories."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) => String(category.id) === categoryId
      ),
    [categories, categoryId]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!categoryId) {
      setError("Please select a participant category.");
      return;
    }

    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    const payload = {
      id_passport: String(form.get("id_passport") || ""),
      full_name: String(form.get("full_name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      country: String(form.get("country") || ""),
      organization: String(form.get("organization") || ""),
      position: String(form.get("position") || ""),
      category_id: Number(categoryId),
      answers,
    };

    try {
      const response = await fetch(`${API}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Registration could not be completed."
        );
      }

      if (!data?.participant) {
        throw new Error(
          "Registration was submitted, but the server returned an unexpected response."
        );
      }

      setSuccess({
        id: data.participant.id,
        amount: data.amount_due,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="success-card">
        <div className="success-icon">✓</div>

        <span className="section-label">REGISTRATION RECEIVED</span>

        <h2>Thank you for registering</h2>

        <p>
          Your registration ID is{" "}
          <strong>#{success.id}</strong>.
        </p>

        <p>
          Amount due:{" "}
          <strong>
            KES {Number(success.amount).toLocaleString()}
          </strong>
        </p>

        <p>
          Your registration is pending payment verification. Please keep
          your registration ID for future reference.
        </p>

        <div className="success-actions">
          <Link
            className="button button-primary"
            href="/payment"
          >
            View payment information
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      {/* PERSONAL INFORMATION */}
      <div className="form-section">
        <h3>Personal Information</h3>

        <div className="form-grid">
          <label>
            Full Name <span className="required">*</span>
            <input
              name="full_name"
              required
              autoComplete="name"
              placeholder="Your full name"
            />
          </label>

          <label>
            ID / Passport Number <span className="required">*</span>
            <input
              name="id_passport"
              required
              placeholder="ID or passport number"
            />
          </label>

          <label>
            Email Address <span className="required">*</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
            />
          </label>

          <label>
            Phone Number <span className="required">*</span>
            <input
              name="phone"
              required
              autoComplete="tel"
              placeholder="+254..."
            />
          </label>

          <label>
            Country
            <input
              name="country"
              autoComplete="country-name"
              placeholder="Kenya"
            />
          </label>

          <label>
            Organization / Institution
            <input
              name="organization"
              placeholder="Organization / institution"
            />
          </label>

          <label className="full">
            Position / Role
            <input
              name="position"
              placeholder="Your role or position"
            />
          </label>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="form-section">
        <h3>Participant Category</h3>

        {loading ? (
          <div className="loading">
            <LoaderCircle className="spin" size={18} />
            Loading approved categories...
          </div>
        ) : categories.length > 0 ? (
          <label>
            Category <span className="required">*</span>

            <select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setAnswers({});
              }}
              required
            >
              <option value="">
                Select participant category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name} — KES{" "}
                  {Number(category.price).toLocaleString()}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="warning">
            No participant categories have been configured yet.
          </div>
        )}

        {selectedCategory?.fields?.length ? (
          <div className="dynamic-fields">
            {selectedCategory.fields.map((field) => (
              <label key={field.key}>
                {field.label}

                <input
                  required
                  name={field.key}
                  type={field.type || "text"}
                  value={answers[field.key] || ""}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
        ) : null}

        {selectedCategory && (
          <div className="price-box">
            <span>Registration Fee</span>

            <strong>
              KES{" "}
              {Number(
                selectedCategory.price
              ).toLocaleString()}
            </strong>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="button button-primary form-submit"
        disabled={submitting || loading || !categoryId}
      >
        {submitting ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Submitting...
          </>
        ) : (
          <>
            Continue Registration
            <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="form-note">
        After registration, you will receive your registration ID and
        payment instructions. Official BIBA Kenya payment details will
        be added once confirmed by the finance team.
      </p>
    </form>
  );
}