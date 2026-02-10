import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Design1 from "./designs/reservation_drawer/Design1";
import { useSalesStore } from "../store/salesStore";

interface DesignProps {
  isOpen: boolean;
  unitPrice: number;
  onClose: () => void;
}

interface Design {
  id: number;
  name: string;
  description: string;
  Component: React.ComponentType<DesignProps>;
}

const DESIGNS: Design[] = [{ id: 1, name: "Modern Cards", description: "Card-based layout with soft shadows and clear hierarchy.", Component: Design1 }];

export const ReservationDrawerDesignsWrapper = () => {
  const [openDesignId, setOpenDesignId] = useState<number | null>(null);
  const { currentReservation } = useSalesStore();

  const ActiveComponent = openDesignId ? DESIGNS.find((d) => d.id === openDesignId)?.Component : null;

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESIGNS.map((design) => (
          <div key={design.id} className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{design.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{design.description}</p>
            </div>
            <Button onClick={() => setOpenDesignId(design.id)} className="w-full bg-slate-100 text-slate-700 font-medium group-hover:bg-blue-50 group-hover:text-blue-600">
              Preview Schedule
            </Button>
          </div>
        ))}
      </div>

      {ActiveComponent && <ActiveComponent isOpen={true} unitPrice={1250000} onClose={() => setOpenDesignId(null)} />}
    </div>
  );
};

export const RESERVATION_DRAWER_DESIGNS = [{ id: 1, name: "Payment Schedule Variations", Component: ReservationDrawerDesignsWrapper }];
