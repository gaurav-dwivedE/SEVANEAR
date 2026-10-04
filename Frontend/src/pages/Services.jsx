import ServiceBrowser from "../components/ServiceBrowser";
import useTitle from "../lib/useTitle";

export default function Services() {
  useTitle("Services — SevaNear");
  return (
    <div className="container-page py-10">
      <h1 className="text-4xl text-ivory-50 md:text-5xl">Find a service</h1>
      <p className="mb-6 mt-2 text-ivory-200">Browse by category, or search by name.</p>
      <ServiceBrowser search />
    </div>
  );
}
