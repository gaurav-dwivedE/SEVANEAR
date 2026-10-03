import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error(err);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl text-ivory-50">Something went wrong</h1>
          <p className="mt-2 text-ivory-200">Please reload the page. If it keeps happening, contact support.</p>
          <button className="btn-primary mt-6" onClick={() => window.location.assign("/")}>
            Back to home
          </button>
        </div>
      </div>
    );
  }
}
