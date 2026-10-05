export default function LoadingState({ label = 'Loading IDSC information…' }) {
  return <div className="loading-state"><span className="spinner" />{label}</div>;
}
