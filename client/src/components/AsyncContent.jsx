/**
 * Renders the four states of an API request inside a section, so a failing endpoint never
 * breaks the rest of the page. `state` is the object returned by useApi.
 */
export default function AsyncContent({ state, isEmpty = () => false, emptyMessage, children }) {
  if (state.status === 'loading') {
    return (
      <p className="state" role="status">
        Loading...
      </p>
    );
  }
  if (state.status === 'error') {
    return (
      <div className="state state--error" role="alert">
        <p>Unable to load content.</p>
        <button type="button" className="state__retry" onClick={state.reload}>
          Try again
        </button>
      </div>
    );
  }
  if (isEmpty(state.data)) return <p className="state">{emptyMessage}</p>;
  return children(state.data);
}
