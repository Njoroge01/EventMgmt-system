"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Clock3,
  CheckCircle2,
  XCircle,
  LogOut,
  LayoutDashboard,
  UserRound,
  Building2,
  Tags,
  Settings,
  RefreshCw,
  ExternalLink,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  adminFetchJson,
  adminLogout,
} from "@/lib/adminApi";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Participant = {
  id: number;
  id_passport: string;
  full_name: string;
  email: string;
  phone: string;
  country: string | null;
  organization: string | null;
  position: string | null;
  category_id: number;
  answers: Record<string, unknown>;
  status: string;
  payment_reference: string | null;
  payment_proof_url: string | null;
  created_at: string;
  category_name?: string;
  price?: number;
};

type Exhibitor = {
  id: number;
  id_passport: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  address: string;
  country: string;
  description: string;
  payment_method: string;
  website_link: string | null;
  price: number;
  status: string;
  payment_reference: string | null;
  payment_proof_url: string | null;
  created_at: string;
};

type Category = {
  id: number;
  name: string;
  price: number;
  fields: unknown[];
};

type View =
  | "overview"
  | "participants"
  | "exhibitors"
  | "categories"
  | "settings";

async function viewPaymentProof(
  type: "participant" | "exhibitor",
  id: number
) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    alert("Admin session expired. Please log in again.");
    return;
  }

  const endpoint =
    type === "participant"
      ? `${API}/admin/participants/${id}/payment-proof`
      : `${API}/admin/exhibitors/${id}/payment-proof`;

  const popup = window.open("", "_blank");

  if (!popup) {
    alert("Please allow pop-ups to view the payment proof.");
    return;
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      popup.close();
      alert(error.error || "Unable to load payment proof.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    popup.location.href = url;

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  } catch (error) {
    console.error("Error loading payment proof:", error);
    popup.close();
    alert("Unable to load payment proof.");
  }
}

export default function AdminPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  const [selectedExhibitor, setSelectedExhibitor] =
    useState<Exhibitor | null>(null);

  const [exhibitorFee, setExhibitorFee] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    loadData();
  }, [router]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [participantsData, exhibitorsData, categoriesData] =
        await Promise.all([
          adminFetchJson<Participant[]>("/admin/participants"),
          adminFetchJson<Exhibitor[]>("/admin/exhibitors"),
          adminFetchJson<Category[]>("/participants/categories"),
        ]);

      setParticipants(participantsData);
      setExhibitors(exhibitorsData);
      setCategories(categoriesData);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "ADMIN_UNAUTHENTICATED"
      ) {
        router.replace("/admin/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateParticipant(
    id: number,
    action: "verify" | "reject"
  ) {
    setActionLoading(id);

    try {
      await adminFetchJson(`/admin/participants/${id}/${action}`, {
        method: "PATCH",
      });

      setSelectedParticipant(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Action failed."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function updateExhibitor(
    id: number,
    action: "verify" | "reject"
  ) {
    setActionLoading(id);

    try {
      await adminFetchJson(`/admin/exhibitors/${id}/${action}`, {
        method: "PATCH",
      });

      setSelectedExhibitor(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Action failed."
      );
    } finally {
      setActionLoading(null);
    }
  }

  function logout() {
    adminLogout();
    router.replace("/admin/login");
  }

  
  const pendingParticipants = participants.filter(
    (p) =>
      p.status === "pending" ||
      p.status === "payment_submitted"
  );

  const verifiedParticipants = participants.filter(
    (p) => p.status === "verified"
  );

  const pendingExhibitors = exhibitors.filter(
    (e) =>
      e.status === "pending" ||
      e.status === "payment_submitted"
  );

  const verifiedExhibitors = exhibitors.filter(
    (e) => e.status === "verified"
  );

  const totalPending =
    pendingParticipants.length +
    pendingExhibitors.length;

  const filteredParticipants = participants.filter((p) => {
    const query = search.toLowerCase();

    return (
      p.full_name.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      (p.organization || "").toLowerCase().includes(query) ||
      (p.country || "").toLowerCase().includes(query)
    );
  });

  const filteredExhibitors = exhibitors.filter((e) => {
    const query = search.toLowerCase();

    return (
      e.full_name.toLowerCase().includes(query) ||
      e.email.toLowerCase().includes(query) ||
      e.organization.toLowerCase().includes(query) ||
      e.country.toLowerCase().includes(query)
    );
  });

  function navigate(nextView: View) {
    setView(nextView);
    setSearch("");
    setSidebarOpen(false);
    setSelectedParticipant(null);
    setSelectedExhibitor(null);
  }

  return (
    <div className="admin-shell">
      {/* Mobile header */}
      <div className="admin-mobile-header">
        <button
          className="admin-menu-button"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <strong>EA Bio-Inputs Conference</strong>

        <button
          className="admin-mobile-refresh"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={19} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-mark">EA</div>

          <div>
            <strong>East Africa</strong>
            <span>Bio-Inputs Conference</span>
          </div>

          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-label">
          ADMINISTRATION
        </div>

        <nav className="admin-nav">
          <button
            className={view === "overview" ? "active" : ""}
            onClick={() => navigate("overview")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={view === "participants" ? "active" : ""}
            onClick={() => navigate("participants")}
          >
            <Users size={18} />
            Participants
            {pendingParticipants.length > 0 && (
              <span className="admin-nav-badge">
                {pendingParticipants.length}
              </span>
            )}
          </button>

          <button
            className={view === "exhibitors" ? "active" : ""}
            onClick={() => navigate("exhibitors")}
          >
            <Store size={18} />
            Exhibitors
            {pendingExhibitors.length > 0 && (
              <span className="admin-nav-badge">
                {pendingExhibitors.length}
              </span>
            )}
          </button>

          <button
            className={view === "categories" ? "active" : ""}
            onClick={() => navigate("categories")}
          >
            <Tags size={18} />
            Categories
          </button>

          <button
            className={view === "settings" ? "active" : ""}
            onClick={() => navigate("settings")}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-logout"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="section-label">
              ADMINISTRATION
            </span>

            <h1>
              {view === "overview" && "Dashboard"}
              {view === "participants" && "Participants"}
              {view === "exhibitors" && "Exhibitors"}
              {view === "categories" && "Participant Categories"}
              {view === "settings" && "Conference Settings"}
            </h1>
          </div>

          <div className="admin-top-actions">
            <button
              className="admin-refresh"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw
                size={17}
                className={loading ? "spin" : ""}
              />
              Refresh
            </button>

            <button
              className="admin-top-logout"
              onClick={logout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="form-error admin-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <RefreshCw
              size={22}
              className="spin"
            />
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {view === "overview" && (
              <section>
                <div className="admin-welcome">
                  <div>
                    <span className="section-label">
                      CONFERENCE ADMINISTRATION
                    </span>

                    <h2>
                      Registration overview
                    </h2>

                    <p>
                      Monitor participants, exhibitors
                      and payment verification from one
                      place.
                    </p>
                  </div>

                  <div className="admin-date">
                    10th–11th February 2027
                    <small>
                      Nairobi, Kenya
                    </small>
                  </div>
                </div>

                <div className="admin-stat-grid">
                  <StatCard
                    icon={<Users size={22} />}
                    label="Total Participants"
                    value={participants.length}
                  />

                  <StatCard
                    icon={<Store size={22} />}
                    label="Total Exhibitors"
                    value={exhibitors.length}
                  />

                  <StatCard
                    icon={<Clock3 size={22} />}
                    label="Pending Review"
                    value={totalPending}
                    highlight
                  />

                  <StatCard
                    icon={<CheckCircle2 size={22} />}
                    label="Verified"
                    value={
                      verifiedParticipants.length +
                      verifiedExhibitors.length
                    }
                  />
                </div>

                <div className="admin-two-column">
                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <div>
                        <h3>
                          Recent Participants
                        </h3>
                        <p>
                          Latest registration activity
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate("participants")
                        }
                        className="admin-link-button"
                      >
                        View all
                      </button>
                    </div>

                    <RegistrationPreview
                      participants={participants.slice(
                        0,
                        5
                      )}
                      onSelect={(participant) => {
                        setSelectedParticipant(
                          participant
                        );
                        setView("participants");
                      }}
                    />
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <div>
                        <h3>
                          Recent Exhibitors
                        </h3>
                        <p>
                          Latest exhibition registrations
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate("exhibitors")
                        }
                        className="admin-link-button"
                      >
                        View all
                      </button>
                    </div>

                    <ExhibitorPreview
                      exhibitors={exhibitors.slice(
                        0,
                        5
                      )}
                      onSelect={(exhibitor) => {
                        setSelectedExhibitor(
                          exhibitor
                        );
                        setView("exhibitors");
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* PARTICIPANTS */}
            {view === "participants" && (
              <section>
                <div className="admin-section-intro">
                  <div>
                    <h2>
                      Registered Participants
                    </h2>
                    <p>
                      Review registration details and
                      verify submitted payments.
                    </p>
                  </div>

                  <div className="admin-search">
                    <Search size={17} />
                    <input
                      placeholder="Search participants..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>
                </div>

                {selectedParticipant ? (
                  <ParticipantDetails
                    participant={selectedParticipant}
                    categories={categories}
                    actionLoading={actionLoading}
                    onBack={() =>
                      setSelectedParticipant(null)
                    }
                    onVerify={() =>
                      updateParticipant(
                        selectedParticipant.id,
                        "verify"
                      )
                    }
                    onReject={() =>
                      updateParticipant(
                        selectedParticipant.id,
                        "reject"
                      )
                    }
                  />
                ) : (
                  <ParticipantTable
                    participants={filteredParticipants}
                    categories={categories}
                    onSelect={setSelectedParticipant}
                  />
                )}
              </section>
            )}

            {/* EXHIBITORS */}
            {view === "exhibitors" && (
              <section>
                <div className="admin-section-intro">
                  <div>
                    <h2>
                      Registered Exhibitors
                    </h2>
                    <p>
                      Review exhibition applications and
                      payment status.
                    </p>
                  </div>

                  <div className="admin-search">
                    <Search size={17} />
                    <input
                      placeholder="Search exhibitors..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>
                </div>

                {selectedExhibitor ? (
                  <ExhibitorDetails
                    exhibitor={selectedExhibitor}
                    actionLoading={actionLoading}
                    onBack={() =>
                      setSelectedExhibitor(null)
                    }
                    onVerify={() =>
                      updateExhibitor(
                        selectedExhibitor.id,
                        "verify"
                      )
                    }
                    onReject={() =>
                      updateExhibitor(
                        selectedExhibitor.id,
                        "reject"
                      )
                    }
                  />
                ) : (
                  <ExhibitorTable
                    exhibitors={filteredExhibitors}
                    onSelect={setSelectedExhibitor}
                  />
                )}
              </section>
            )}

            {/* CATEGORIES */}
            {view === "categories" && (
              <CategoriesSection
                categories={categories}
                onRefresh={loadData}
              />
            )}

            {/* SETTINGS */}
            {view === "settings" && (
              <SettingsSection
                fee={exhibitorFee}
                setFee={setExhibitorFee}
                onSaved={loadData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`admin-stat-card ${
        highlight ? "highlight" : ""
      }`}
    >
      <div className="admin-stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

/* =========================
   REGISTRATION PREVIEW
========================= */

function RegistrationPreview({
  participants,
  onSelect,
}: {
  participants: Participant[];
  onSelect: (participant: Participant) => void;
}) {
  if (participants.length === 0) {
    return (
      <div className="admin-empty">
        No participant registrations yet.
      </div>
    );
  }

  return (
    <div className="admin-preview-list">
      {participants.map((participant) => (
        <button
          key={participant.id}
          onClick={() => onSelect(participant)}
          className="admin-preview-row"
        >
          <div className="admin-avatar">
            {participant.full_name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="admin-preview-info">
            <strong>
              {participant.full_name}
            </strong>

            <span>{participant.email}</span>
          </div>

          <StatusBadge status={participant.status} />
        </button>
      ))}
    </div>
  );
}

/* =========================
   EXHIBITOR PREVIEW
========================= */

function ExhibitorPreview({
  exhibitors,
  onSelect,
}: {
  exhibitors: Exhibitor[];
  onSelect: (exhibitor: Exhibitor) => void;
}) {
  if (exhibitors.length === 0) {
    return (
      <div className="admin-empty">
        No exhibitor registrations yet.
      </div>
    );
  }

  return (
    <div className="admin-preview-list">
      {exhibitors.map((exhibitor) => (
        <button
          key={exhibitor.id}
          onClick={() => onSelect(exhibitor)}
          className="admin-preview-row"
        >
          <div className="admin-avatar">
            {exhibitor.organization
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="admin-preview-info">
            <strong>
              {exhibitor.organization}
            </strong>

            <span>{exhibitor.full_name}</span>
          </div>

          <StatusBadge status={exhibitor.status} />
        </button>
      ))}
    </div>
  );
}

/* =========================
   PARTICIPANT TABLE
========================= */

function ParticipantTable({
  participants,
  categories,
  onSelect,
}: {
  participants: Participant[];
  categories: Category[];
  onSelect: (participant: Participant) => void;
}) {
  return (
    <div className="admin-table-card">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Participant</th>
              <th>Category</th>
              <th>Country</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty">
                    No participants found.
                  </div>
                </td>
              </tr>
            ) : (
              participants.map((participant) => {
                const category = categories.find(
                  (c) =>
                    c.id === participant.category_id
                );

                return (
                  <tr key={participant.id}>
                    <td>
                      <strong>
                        {participant.full_name}
                      </strong>

                      <small>
                        {participant.email}
                      </small>
                    </td>

                    <td>
                      {category?.name || "—"}
                    </td>

                    <td>
                      {participant.country || "—"}
                    </td>

                    <td>
                      {participant.payment_reference ? (
                        <span className="payment-reference">
                          {participant.payment_reference}
                        </span>
                      ) : (
                        "Not submitted"
                      )}
                    </td>

                    <td>
                      <StatusBadge
                        status={participant.status}
                      />
                    </td>

                    <td>
                      <button
                        className="admin-view-button"
                        onClick={() =>
                          onSelect(participant)
                        }
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   PARTICIPANT DETAILS
========================= */

function ParticipantDetails({
  participant,
  categories,
  actionLoading,
  onBack,
  onVerify,
  onReject,
}: {
  participant: Participant;
  categories: Category[];
  actionLoading: number | null;
  onBack: () => void;
  onVerify: () => void;
  onReject: () => void;
}) {
  const category = categories.find(
    (c) => c.id === participant.category_id
  );

  return (
    <div className="admin-detail-card">
      <button
        className="admin-back-button"
        onClick={onBack}
      >
        ← Back to participants
      </button>

      <div className="admin-detail-header">
        <div className="admin-detail-avatar">
          {participant.full_name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <span className="section-label">
            PARTICIPANT #{participant.id}
          </span>

          <h2>{participant.full_name}</h2>

          <StatusBadge status={participant.status} />
        </div>
      </div>

      <div className="admin-detail-grid">
        <DetailItem
          label="ID / Passport"
          value={participant.id_passport}
        />

        <DetailItem
          label="Email"
          value={participant.email}
        />

        <DetailItem
          label="Phone"
          value={participant.phone}
        />

        <DetailItem
          label="Country"
          value={participant.country}
        />

        <DetailItem
          label="Organization"
          value={participant.organization}
        />

        <DetailItem
          label="Position"
          value={participant.position}
        />

        <DetailItem
          label="Category"
          value={category?.name}
        />

        <DetailItem
          label="Amount Due"
          value={
            category
              ? `KES ${Number(
                  category.price
                ).toLocaleString()}`
              : "—"
          }
        />
      </div>

      <div className="admin-payment-section">
        <h3>Payment Information</h3>

        <div className="admin-payment-box">
          <div>
            <span>Payment Reference</span>
            <strong>
              {participant.payment_reference ||
                "Not submitted"}
            </strong>
          </div>

          {participant.payment_proof_url ? (
            <button
  type="button"
  onClick={() => viewPaymentProof("participant", participant.id)}
>
  View Payment Proof
</button>
          ) : (
            <span className="muted">
              No payment proof uploaded.
            </span>
          )}
        </div>
      </div>

      {participant.status !== "verified" &&
        participant.status !== "rejected" && (
          <div className="admin-action-bar">
            <button
              className="admin-reject-button"
              onClick={onReject}
              disabled={actionLoading === participant.id}
            >
              <XCircle size={17} />
              Reject
            </button>

            <button
              className="admin-verify-button"
              onClick={onVerify}
              disabled={actionLoading === participant.id}
            >
              <CheckCircle2 size={17} />
              {actionLoading === participant.id
                ? "Processing..."
                : "Verify Payment"}
            </button>
          </div>
        )}
    </div>
  );
}

/* =========================
   EXHIBITOR TABLE
========================= */

function ExhibitorTable({
  exhibitors,
  onSelect,
}: {
  exhibitors: Exhibitor[];
  onSelect: (exhibitor: Exhibitor) => void;
}) {
  return (
    <div className="admin-table-card">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Representative</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {exhibitors.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty">
                    No exhibitors found.
                  </div>
                </td>
              </tr>
            ) : (
              exhibitors.map((exhibitor) => (
                <tr key={exhibitor.id}>
                  <td>
                    <strong>
                      {exhibitor.organization}
                    </strong>

                    <small>
                      {exhibitor.country}
                    </small>
                  </td>

                  <td>
                    <strong>
                      {exhibitor.full_name}
                    </strong>

                    <small>
                      {exhibitor.email}
                    </small>
                  </td>

                  <td>
                    {exhibitor.payment_method}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      exhibitor.price
                    ).toLocaleString()}
                  </td>

                  <td>
                    <StatusBadge
                      status={exhibitor.status}
                    />
                  </td>

                  <td>
                    <button
                      className="admin-view-button"
                      onClick={() =>
                        onSelect(exhibitor)
                      }
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   EXHIBITOR DETAILS
========================= */

function ExhibitorDetails({
  exhibitor,
  actionLoading,
  onBack,
  onVerify,
  onReject,
}: {
  exhibitor: Exhibitor;
  actionLoading: number | null;
  onBack: () => void;
  onVerify: () => void;
  onReject: () => void;
}) {
  return (
    <div className="admin-detail-card">
      <button
        className="admin-back-button"
        onClick={onBack}
      >
        ← Back to exhibitors
      </button>

      <div className="admin-detail-header">
        <div className="admin-detail-avatar">
          {exhibitor.organization
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <span className="section-label">
            EXHIBITOR #{exhibitor.id}
          </span>

          <h2>{exhibitor.organization}</h2>

          <StatusBadge status={exhibitor.status} />
        </div>
      </div>

      <div className="admin-detail-grid">
        <DetailItem
          label="Representative"
          value={exhibitor.full_name}
        />

        <DetailItem
          label="ID / Passport"
          value={exhibitor.id_passport}
        />

        <DetailItem
          label="Email"
          value={exhibitor.email}
        />

        <DetailItem
          label="Phone"
          value={exhibitor.phone}
        />

        <DetailItem
          label="Country"
          value={exhibitor.country}
        />

        <DetailItem
          label="Address"
          value={exhibitor.address}
        />

        <DetailItem
          label="Payment Method"
          value={exhibitor.payment_method}
        />

        <DetailItem
          label="Exhibition Fee"
          value={`KES ${Number(
            exhibitor.price
          ).toLocaleString()}`}
        />
      </div>

      <div className="admin-description">
        <h3>Exhibition Description</h3>
        <p>{exhibitor.description}</p>

        {exhibitor.website_link && (
          <a
            href={exhibitor.website_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Visit organization website
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      <div className="admin-payment-section">
        <h3>Payment Information</h3>

        <div className="admin-payment-box">
          <div>
            <span>Payment Reference</span>
            <strong>
              {exhibitor.payment_reference ||
                "Not submitted"}
            </strong>
          </div>

          {exhibitor.payment_proof_url ? (
            <button
  type="button"
  onClick={() => viewPaymentProof("exhibitor", exhibitor.id)}
>
  View Payment Proof
</button>
          ) : (
            <span className="muted">
              No payment proof uploaded.
            </span>
          )}
        </div>
      </div>

      {exhibitor.status !== "verified" &&
        exhibitor.status !== "rejected" && (
          <div className="admin-action-bar">
            <button
              className="admin-reject-button"
              onClick={onReject}
              disabled={actionLoading === exhibitor.id}
            >
              <XCircle size={17} />
              Reject
            </button>

            <button
              className="admin-verify-button"
              onClick={onVerify}
              disabled={actionLoading === exhibitor.id}
            >
              <CheckCircle2 size={17} />
              {actionLoading === exhibitor.id
                ? "Processing..."
                : "Verify Payment"}
            </button>
          </div>
        )}
    </div>
  );
}

/* =========================
   CATEGORIES
========================= */

function CategoriesSection({
  categories,
  onRefresh,
}: {
  categories: Category[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] =
    useState<number | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit(category: Category) {
    setEditing(category.id);
    setName(category.name);
    setPrice(String(category.price));
  }

  async function save() {
    if (!editing) return;

    setSaving(true);
    setError("");

    try {
      await adminFetchJson(
        `/admin/categories/${editing}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name,
            price: Number(price),
          }),
        }
      );

      setEditing(null);
      onRefresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="admin-section-intro">
        <div>
          <h2>Participant Categories</h2>
          <p>
            Manage registration categories and their
            fees.
          </p>
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="admin-category-grid">
        {categories.map((category) => (
          <div
            className="admin-category-card"
            key={category.id}
          >
            {editing === category.id ? (
              <>
                <label>
                  Category Name
                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </label>

                <label>
                  Price (KES)
                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                  />
                </label>

                <div className="inline-actions">
                  <button
                    className="button button-primary"
                    onClick={save}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    className="button button-outline"
                    onClick={() =>
                      setEditing(null)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="admin-category-number">
                  #{category.id}
                </span>

                <h3>{category.name}</h3>

                <strong>
                  KES{" "}
                  {Number(
                    category.price
                  ).toLocaleString()}
                </strong>

                <button
                  className="admin-view-button"
                  onClick={() =>
                    startEdit(category)
                  }
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================
   SETTINGS
========================= */

function SettingsSection({
  fee,
  setFee,
  onSaved,
}: {
  fee: string;
  setFee: (value: string) => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveFee() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await adminFetchJson(
        "/admin/settings/exhibitor-fee",
        {
          method: "PATCH",
          body: JSON.stringify({
            fee: Number(fee),
          }),
        }
      );

      setMessage(
        "Exhibitor fee updated successfully."
      );

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update fee."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="admin-section-intro">
        <div>
          <h2>Conference Settings</h2>
          <p>
            Configure registration-related settings.
          </p>
        </div>
      </div>

      <div className="admin-settings-card">
        <div>
          <span className="section-label">
            EXHIBITION
          </span>

          <h3>Exhibitor Registration Fee</h3>

          <p>
            This fee is applied when an exhibitor
            registers. The current fee is stored in
            the conference settings.
          </p>
        </div>

        <div className="admin-setting-form">
          <label>
            Fee in Kenyan Shillings

            <input
              type="number"
              value={fee}
              onChange={(e) =>
                setFee(e.target.value)
              }
              placeholder="16000"
            />
          </label>

          <button
            className="button button-primary"
            onClick={saveFee}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Exhibitor Fee"}
          </button>

          {message && (
            <div className="admin-success">
              {message}
            </div>
          )}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   DETAIL ITEM
========================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="admin-detail-item">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const label = status.replace("_", " ");

  return (
    <span
      className={`admin-status ${status}`}
    >
      {label}
    </span>
  );
}
