import { Component } from 'react';

/** Last line of defence: an unexpected render error shows a message instead of a blank page. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="state state--error" role="alert" style={{ padding: '4rem 1rem', justifyContent: 'center' }}>
        <p>Unable to load content.</p>
        <button type="button" className="state__retry" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}