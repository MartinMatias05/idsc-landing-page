export default function ErrorState({ onRetry }) {
  return (
    <div className="error-state">
      <strong>Information is temporarily unavailable.</strong>
      <span>Please try again or continue using the available navigation.</span>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
