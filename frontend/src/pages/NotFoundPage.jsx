import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return <main className="empty-state not-found"><span>404</span><p className="eyebrow">A little off the map</p><h1>This page wandered off.</h1><p>Let’s get you back to somewhere lovely.</p><Link className="primary-button" to="/">Go home</Link></main>;
}
