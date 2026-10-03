import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../components/ui/Modal";
import Icon from "../components/ui/Icon";
import Stars from "../components/ui/Stars";
import BookServiceForm from "../components/booking/BookServiceForm";
import useTitle from "../lib/useTitle";
import { servicesApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { img, rupee, VISIT_FEE } from "../lib/format";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    servicesApi.get(id).then(({ data }) => setService(data.data)).catch(() => setMissing(true));
  }, [id]);

  useTitle(service ? `${service.name} — SevaNear` : "SevaNear");

  if (missing)
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl text-ivory-50">Service not found</h1>
        <Link to="/services" className="btn-primary mt-6">Browse services</Link>
      </div>
    );
  if (!service) return <div className="container-page py-10"><div className="skeleton h-96" /></div>;

  const book = () => (isAuthenticated ? setOpen(true) : navigate("/login", { state: { from: { pathname: `/services/${id}` } } }));

  return (
    <div className="container-page py-8">
      <Link to="/services" className="inline-flex items-center gap-1 text-sm text-ivory-200 hover:text-ivory-50"><Icon name="left" size={16} /> All services</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <img src={img(service)} alt={service.name} className="aspect-[4/3] w-full rounded-3xl object-cover" />
        <div>
          <p className="eyebrow">{service.category}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory-50">{service.name}</h1>
          <div className="mt-2"><Stars avg={service.ratingAvg} count={service.ratingCount} /></div>
          <p className="mt-4 text-ivory-200">{service.description}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {(service.inclusions || []).map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ivory-100"><Icon name="check" size={16} className="shrink-0 text-black" />{i}</li>
            ))}
          </ul>
          <div className="card-surface mt-6 p-5">
            <div className="flex justify-between"><span className="text-ivory-200">Starting price</span><b className="font-display text-2xl text-ivory-50">{rupee(service.startingPrice)}</b></div>
            <div className="mt-1 flex justify-between text-sm text-ivory-200"><span>Visit fee</span><span>{rupee(VISIT_FEE)}</span></div>
            <div className="flex justify-between text-sm text-ivory-200"><span>Typical duration</span><span>~{service.durationMins} min</span></div>
            <p className="mt-3 text-xs text-ivory-200">Parts, if needed, are quoted before any work starts. Free cancellation until the partner is on the way.</p>
          </div>
          <button className="btn-accent mt-5 w-full py-4 text-base" onClick={book}>Book this service</button>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={done ? "Booking placed" : "Book " + service.name}>
        {done ? (
          <div className="text-center">
            <p className="text-ivory-200">We're assigning a verified partner. You'll see updates in your dashboard.</p>
            <Link to="/dashboard" className="btn-primary mt-5">Track booking</Link>
          </div>
        ) : (
          <BookServiceForm service={service} onSuccess={() => setDone(true)} />
        )}
      </Modal>
    </div>
  );
}
