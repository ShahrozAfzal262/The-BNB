import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ErrorState, LoadingState } from "../components/PageStates.jsx";

const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const statusLabel = { confirmed: "Confirmed", pending: "Pending", cancelled: "Cancelled" };

// Admin only: how much money moved, how much The bnb keeps (profit), and what was lost to cancellations.
export default function AdminPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.isAdmin) return;
    api("/admin/summary")
      .then(setData)
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [user]);

  if (!user?.isAdmin) {
    return <ErrorState message="Only admins can open this page." />;
  }
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading admin overview…" />;

  const { totals, hosts, months, recent, feePercent } = data;
  const maxMonth = Math.max(1, ...months.map((month) => Math.max(month.gross, month.cancelled)));

  return (
    <main className="dashboard-page admin-page">
      <p className="eyebrow">Admin</p>
      <h1>Profit and loss</h1>
      <p className="admin-intro">
        The bnb keeps <strong>{feePercent}%</strong> of every confirmed booking. The rest is the host’s share.
      </p>

      <div className="admin-cards">
        <div className="admin-card">
          <span>Total confirmed bookings</span>
          <strong>{money(totals.grossBookings)}</strong>
          <small>{totals.confirmedCount} bookings</small>
        </div>
        <div className="admin-card admin-profit">
          <span>Platform profit ({feePercent}%)</span>
          <strong>{money(totals.platformProfit)}</strong>
          <small>The bnb share</small>
        </div>
        <div className="admin-card">
          <span>Hosts’ share</span>
          <strong>{money(totals.hostsShare)}</strong>
          <small>Paid out to hosts</small>
        </div>
        <div className="admin-card admin-loss">
          <span>Loss (cancelled)</span>
          <strong>{money(totals.cancelledAmount)}</strong>
          <small>
            {totals.cancelledCount} bookings · {money(totals.lostPlatformFee)} fee lost
          </small>
        </div>
        <div className="admin-card">
          <span>Waiting for host</span>
          <strong>{money(totals.pendingAmount)}</strong>
          <small>{totals.pendingCount} pending bookings</small>
        </div>
        <div className="admin-card">
          <span>Listings</span>
          <strong>{totals.listings}</strong>
          <small>{hosts.length} hosts</small>
        </div>
      </div>

      <section className="admin-section">
        <h2>Last 6 months</h2>
        <div className="admin-chart" role="img" aria-label="Bookings per month">
          {months.map((month) => (
            <div className="admin-bar-group" key={month.label}>
              <div className="admin-bars">
                <span className="bar bar-gross" style={{ height: `${(month.gross / maxMonth) * 100}%` }} title={`Bookings ${money(month.gross)}`} />
                <span className="bar bar-profit" style={{ height: `${(month.profit / maxMonth) * 100}%` }} title={`Profit ${money(month.profit)}`} />
                <span className="bar bar-loss" style={{ height: `${(month.cancelled / maxMonth) * 100}%` }} title={`Cancelled ${money(month.cancelled)}`} />
              </div>
              <small>{month.label}</small>
            </div>
          ))}
        </div>
        <p className="admin-legend">
          <i className="dot dot-gross" /> Confirmed bookings <i className="dot dot-profit" /> Platform profit <i className="dot dot-loss" /> Cancelled (loss)
        </p>
      </section>

      <section className="admin-section">
        <h2>Share of every host</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Host</th>
                <th>Stays</th>
                <th>Confirmed</th>
                <th>Total</th>
                <th>The bnb share</th>
                <th>Host share</th>
                <th>Pending</th>
                <th>Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr key={host.id}>
                  <td>
                    <strong>{host.name}</strong>
                    <small>{host.email}</small>
                  </td>
                  <td>{host.listings}</td>
                  <td>{host.bookings}</td>
                  <td>{money(host.gross)}</td>
                  <td className="positive">{money(host.platformShare)}</td>
                  <td>{money(host.hostShare)}</td>
                  <td>{money(host.pending)}</td>
                  <td className="negative">{money(host.cancelled)}</td>
                </tr>
              ))}
              {hosts.length === 0 && (
                <tr>
                  <td colSpan="8">No hosts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2>Latest bookings</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Stay</th>
                <th>Guest</th>
                <th>Host</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.listing}</td>
                  <td>{booking.guest}</td>
                  <td>{booking.host}</td>
                  <td>{money(booking.amount)}</td>
                  <td>
                    <span className={`status-pill status-${booking.status}`}>{statusLabel[booking.status]}</span>
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan="6">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Link to="/dashboard" className="back-link">
        Back to dashboard
      </Link>
    </main>
  );
}
