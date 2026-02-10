import { Building2, MapPin, Maximize2, Bed, Bath, Car, Check, ArrowRight } from "lucide-react";
import { useSalesStore } from "../store/salesStore";
import ReservationDrawer from "../components/ReservationDrawer";

// Dummy unit data
const dummyUnit = {
  id: "UNIT-A101",
  title: "Villa A-101",
  type: "Villa",
  project: "Palm Hills",
  location: "6th of October City, Giza",
  price: 12500000,
  pricePerMeter: 35000,
  area: 357,
  bedrooms: 4,
  bathrooms: 3,
  parking: 2,
  floor: "Ground + 1",
  view: "Garden View",
  status: "Available",
  features: ["Private Garden", "Smart Home System", "Central A/C", "Built-in Kitchen", "Marble Flooring", "High Ceilings"],
  description: "Luxurious 4-bedroom villa with a private garden and modern amenities. This stunning property features an open-plan living area, gourmet kitchen, and spacious bedrooms with en-suite bathrooms.",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const UnitDetailsPage = () => {
  const { openReservationDrawer, isReservationDrawerOpen } = useSalesStore();

  const handleReserve = () => {
    openReservationDrawer(dummyUnit.id, dummyUnit.title);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 mb-8 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left Side - Unit Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wide">{dummyUnit.status}</span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">{dummyUnit.type}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{dummyUnit.title}</h1>

              <div className="flex items-center gap-2 text-slate-400 mb-6">
                <MapPin size={16} />
                <span>{dummyUnit.location}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Building2 size={16} />
                <span>{dummyUnit.project}</span>
              </div>
            </div>

            {/* Right Side - Price & Action */}
            <div className="md:text-right">
              <p className="text-slate-400 text-sm mb-1">Starting from</p>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{formatCurrency(dummyUnit.price)}</p>
              <p className="text-slate-500 text-sm mb-6">{formatCurrency(dummyUnit.pricePerMeter)} / m²</p>

              <button onClick={handleReserve} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                <span className="flex items-center gap-2">
                  Reserve Now
                  <ArrowRight size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Unit Specs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Maximize2 size={18} className="text-blue-500" />
                </div>
                <span>Area</span>
              </div>
              <span className="font-semibold text-slate-800">{dummyUnit.area} m²</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Bed size={18} className="text-purple-500" />
                </div>
                <span>Bedrooms</span>
              </div>
              <span className="font-semibold text-slate-800">{dummyUnit.bedrooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Bath size={18} className="text-teal-500" />
                </div>
                <span>Bathrooms</span>
              </div>
              <span className="font-semibold text-slate-800">{dummyUnit.bathrooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Car size={18} className="text-amber-500" />
                </div>
                <span>Parking</span>
              </div>
              <span className="font-semibold text-slate-800">{dummyUnit.parking}</span>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Additional Info</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Floor</span>
              <span className="font-semibold text-slate-800">{dummyUnit.floor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">View</span>
              <span className="font-semibold text-slate-800">{dummyUnit.view}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Unit ID</span>
              <span className="font-mono text-sm text-slate-500">{dummyUnit.id}</span>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Features</h3>
          <div className="space-y-3">
            {dummyUnit.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check size={12} className="text-emerald-600" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Description</h3>
        <p className="text-slate-600 leading-relaxed">{dummyUnit.description}</p>
      </div>

      {/* Reservation Drawer */}
      <ReservationDrawer isOpen={isReservationDrawerOpen} unitPrice={dummyUnit.price} />
    </div>
  );
};

export default UnitDetailsPage;
