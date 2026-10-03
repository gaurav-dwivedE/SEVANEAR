import { Link } from "react-router-dom";
import Reveal from "../components/motion/Reveal";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <Reveal>
        <p className="font-display text-8xl text-ivory-50">404</p>
        <p className="mt-4 text-ivory-200/55">This page wandered off somewhere.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Back to home
        </Link>
      </Reveal>
    </div>
  );
}
