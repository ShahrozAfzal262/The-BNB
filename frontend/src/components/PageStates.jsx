export function LoadingState({ label = "Loading…" }) {
  return <div className="page-loading">{label}</div>;
}

export function ErrorState({ message, onRetry }) {
  return <div className="empty-state"><h2>We hit a little snag</h2><p>{message}</p>{onRetry && <button className="primary-button" onClick={onRetry}>Try again</button>}</div>;
}
