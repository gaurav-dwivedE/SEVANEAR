import { Link } from "react-router-dom";
import Stars from "./Stars";
import { img, rupee } from "../../lib/format";

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service._id}`}
      className="group card-surface block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-ink-700">
        <img
          src={img(service)}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-ivory-50">{service.name}</h3>
          <Stars avg={service.ratingAvg} count={service.ratingCount} />
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-ivory-200">{service.description}</p>
        <p className="mt-3 text-sm text-ivory-200">
          From <b className="text-base text-ivory-50">{rupee(service.startingPrice)}</b>
        </p>
      </div>
    </Link>
  );
}
