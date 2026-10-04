import { Link } from "react-router-dom";
import Stars from "./Stars";
import { img, onImgError, rupee } from "../../lib/format";

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service._id}`} className="group block overflow-hidden rounded-xl border border-ink-700 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-ink-700">
        <img src={img(service)} onError={onImgError} alt={service.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        {service.category?.name && <p className="mb-1 text-[11px] font-semibold text-ivory-200">{service.category.name}</p>}
        <h3 className="text-lg font-bold leading-snug text-ivory-50">{service.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ivory-200">{service.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-ivory-200">From <b className="text-base text-ivory-50">{rupee(service.startingPrice)}</b></span>
          <Stars avg={service.ratingAvg} count={service.ratingCount} />
        </div>
      </div>
    </Link>
  );
}
