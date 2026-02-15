import { useParams, useNavigate } from "react-router-dom";
import { Building2, MapPin, Maximize2, Bed, Bath, Car, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSalesStore } from "../../store/salesStore";
import { useCompoundsStore } from "../../store/compoundsStore";
import ReservationDrawer from "../../components/sales/ReservationDrawer";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const UnitDetailsPage = () => {
  const { compoundId, unitId } = useParams<{ compoundId: string; unitId: string }>();
  const navigate = useNavigate();
  const { openReservationDrawer, isReservationDrawerOpen } = useSalesStore();
  const { getUnitById, getCompoundById } = useCompoundsStore();

  const unit = unitId ? getUnitById(unitId) : undefined;
  const compound = compoundId ? getCompoundById(compoundId) : undefined;

  const handleReserve = () => {
    if (unit) {
      openReservationDrawer(unit.id, unit.title);
    }
  };

  if (!unit || !compound) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Unit not found</h2>
          <button onClick={() => navigate(compoundId ? `/sales/compounds/${compoundId}` : "/sales/compounds")} className="text-blue-500 hover:text-blue-600 font-medium text-sm">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-24 sm:pb-8">
      {/* Back Navigation */}
      <div className="mb-4 sm:mb-6">
        <button onClick={() => navigate(`/sales/compounds/${compoundId}`)} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <ArrowLeft size={18} />
          <span>Back to {compound.name}</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 mb-4 sm:mb-8 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative p-5 sm:p-8 md:p-12">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Top Row - Status & Type */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${unit.status === "Available" ? "bg-emerald-500/20 text-emerald-400" : unit.status === "Reserved" ? "bg-amber-500/20 text-amber-400" : unit.status === "Sold" ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}`}>{unit.status}</span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">{unit.type}</span>
            </div>

            {/* Unit Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{unit.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>{compound.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  <span>{compound.name}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm mb-0.5">Starting from</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{formatCurrency(unit.price)}</p>
                <p className="text-slate-500 text-xs sm:text-sm">{formatCurrency(unit.pricePerMeter)} / m²</p>
              </div>

              {unit.status === "Available" && (
                <Button onClick={handleReserve} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    Reserve Now
                    <ArrowRight size={18} />
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Horizontal Scroll on Mobile */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-4 sm:hidden scrollbar-none -mx-4 px-4">
        <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-4 shadow-sm min-w-[120px]">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
            <Maximize2 size={18} className="text-blue-500" />
          </div>
          <p className="text-xs text-slate-500">BUA</p>
          <p className="font-bold text-slate-800">{unit.bua} m²</p>
        </div>
        <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-4 shadow-sm min-w-[120px]">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-2">
            <Bed size={18} className="text-purple-500" />
          </div>
          <p className="text-xs text-slate-500">Bedrooms</p>
          <p className="font-bold text-slate-800">{unit.bedrooms}</p>
        </div>
        <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-4 shadow-sm min-w-[120px]">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-2">
            <Bath size={18} className="text-teal-500" />
          </div>
          <p className="text-xs text-slate-500">Bathrooms</p>
          <p className="font-bold text-slate-800">{unit.bathrooms}</p>
        </div>
        <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-4 shadow-sm min-w-[120px]">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-2">
            <Car size={18} className="text-amber-500" />
          </div>
          <p className="text-xs text-slate-500">Parking</p>
          <p className="font-bold text-slate-800">{unit.parking}</p>
        </div>
      </div>

      {/* Details Grid - Desktop */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
        {/* Quick Stats Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Unit Specs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Maximize2 size={18} className="text-blue-500" />
                </div>
                <span>BUA</span>
              </div>
              <span className="font-semibold text-slate-800">{unit.bua} m²</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Bed size={18} className="text-purple-500" />
                </div>
                <span>Bedrooms</span>
              </div>
              <span className="font-semibold text-slate-800">{unit.bedrooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Bath size={18} className="text-teal-500" />
                </div>
                <span>Bathrooms</span>
              </div>
              <span className="font-semibold text-slate-800">{unit.bathrooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Car size={18} className="text-amber-500" />
                </div>
                <span>Parking</span>
              </div>
              <span className="font-semibold text-slate-800">{unit.parking}</span>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Additional Info</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Floor</span>
              <span className="font-semibold text-slate-800">{unit.floor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">View</span>
              <span className="font-semibold text-slate-800">{unit.view}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Unit ID</span>
              <span className="font-mono text-sm text-slate-500">{unit.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Compound</span>
              <span className="font-semibold text-slate-800">{compound.name}</span>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Features</h3>
          <div className="space-y-3">
            {unit.features.map((feature, index) => (
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

      {/* Mobile: Additional Info & Features */}
      <div className="grid grid-cols-1 gap-4 sm:hidden mb-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Additional Info</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-500">Floor</p>
              <p className="font-semibold text-slate-800 text-sm">{unit.floor}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">View</p>
              <p className="font-semibold text-slate-800 text-sm">{unit.view}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Unit ID</p>
              <p className="font-mono text-xs text-slate-500">{unit.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Features</h3>
          <div className="flex flex-wrap gap-2">
            {unit.features.map((feature, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                <Check size={10} />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 sm:mb-4">Description</h3>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{unit.description}</p>
      </div>

      {/* Mobile: Fixed Reserve Button */}
      {unit.status === "Available" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg sm:hidden z-30">
          <Button onClick={handleReserve} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30">
            <span className="flex items-center justify-center gap-2">
              Reserve Now
              <ArrowRight size={18} />
            </span>
          </Button>
        </div>
      )}

      {/* Reservation Drawer */}
      <ReservationDrawer isOpen={isReservationDrawerOpen} unitPrice={unit.price} />
    </div>
  );
};

export default UnitDetailsPage;
