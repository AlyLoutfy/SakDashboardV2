import React, { useState } from "react";
import { Check, X, Clock, FileCheck, User, ChevronRight, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---
type StepStatus = "approved" | "rejected" | "pending" | "waiting";

interface Step {
  id: string;
  name: string;
  status: StepStatus;
  approvers: string[];
  date?: string;
  role: string;
}

const STEPS: Step[] = [
  { id: "1", name: "Sales Verification", status: "approved", approvers: ["Mohamed Darwesh"], date: "Oct 24, 10:30 AM", role: "Sales Manager" },
  { id: "2", name: "Finance Review", status: "approved", approvers: ["Ahmed Essam"], date: "Oct 24, 02:15 PM", role: "Finance Officer" },
  { id: "3", name: "Management Approval", status: "pending", approvers: ["Sarah Wilson", "Mike Ross"], role: "General Manager" },
  { id: "4", name: "Contract Generation", status: "waiting", approvers: [], role: "Legal Team" },
];

const getStatusColor = (status: StepStatus) => {
  switch (status) {
    case "approved":
      return "bg-emerald-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "pending":
      return "bg-amber-500 text-white";
    case "waiting":
      return "bg-gray-200 text-gray-400";
    default:
      return "bg-gray-200";
  }
};

const getStatusBg = (status: StepStatus) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "waiting":
      return "bg-gray-50 text-gray-400 border-gray-100";
  }
};

// --- Design 1: Vertical Elegant Timeline ---
const Design1 = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Approval Progress</h3>
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        return (
          <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Line */}
            {!isLast && <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${step.status === "approved" ? "bg-emerald-200" : "bg-gray-100"}`} />}

            {/* Icon */}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${step.status === "approved" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : step.status === "pending" ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-gray-50 border-gray-200 text-gray-300"}`}>{step.status === "approved" ? <Check size={18} strokeWidth={3} /> : step.status === "pending" ? <Clock size={18} /> : <User size={18} />}</div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`text-sm font-bold ${step.status === "waiting" ? "text-gray-400" : "text-gray-900"}`}>{step.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{step.role}</p>
                </div>
                {step.date && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{step.date}</span>}
              </div>

              {/* Approvers avatars */}
              {step.approvers.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pl-1">
                  {step.approvers.map((approver) => (
                    <div key={approver} className="flex items-center gap-1.5 bg-gray-50 pr-2 py-0.5 rounded-full border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-700 shadow-sm">{approver.charAt(0)}</div>
                      <span className="text-[10px] text-gray-600 font-medium">{approver}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// --- Design 2: Horizontal Stepper Cards ---
const Design2 = () => (
  <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 max-w-2xl mx-auto overflow-x-auto">
    <div className="flex items-start min-w-[600px]">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        return (
          <div key={step.id} className={`flex-1 relative ${!isLast ? "pr-8" : ""}`}>
            {/* Connector Line */}
            {!isLast && (
              <div className="absolute top-5 left-10 right-0 h-0.5 bg-gray-200">
                <div className={`h-full bg-emerald-500 transition-all ${step.status === "approved" ? "w-full" : "w-0"}`} />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-3 transition-colors ${step.status === "approved" ? "bg-emerald-500 text-white shadow-emerald-200" : step.status === "pending" ? "bg-white border-2 border-amber-500 text-amber-500" : "bg-white border border-gray-200 text-gray-300"}`}>{step.status === "approved" ? <Check size={20} /> : step.status === "pending" ? <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" /> : <span className="text-sm font-bold">{index + 1}</span>}</div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">{step.name}</h4>
              <span className="text-[10px] text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">{step.role}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// --- Design 3: Compact Card List ---
const Design3 = () => (
  <div className="max-w-md mx-auto space-y-3">
    {STEPS.map((step, index) => (
      <div key={step.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${getStatusBg(step.status)}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${step.status === "approved" ? "bg-emerald-200 text-emerald-800" : step.status === "pending" ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-400"}`}>{step.status === "approved" ? <Check size={16} strokeWidth={3} /> : step.status === "pending" ? <Clock size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <h4 className="text-sm font-bold truncate">{step.name}</h4>
            {step.status === "approved" && <span className="text-[10px] font-mono opacity-70">10:30 AM</span>}
          </div>
          <p className="text-xs opacity-80 flex items-center gap-1.5">
            <User size={10} />
            {step.approvers.length > 0 ? step.approvers[0] : "Waiting..."}
          </p>
        </div>
        {step.status === "pending" && <button className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-amber-700">Remind</button>}
      </div>
    ))}
  </div>
);

// --- Design 4: "Subway" Map (Creative) ---
const Design4 = () => (
  <div className="bg-gray-900 p-8 rounded-3xl max-w-lg mx-auto">
    <div className="space-y-8">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        return (
          <div key={step.id} className="relative pl-8">
            {/* Line */}
            {!isLast && <div className="absolute left-[11px] top-3 bottom-[-32px] w-0.5 bg-gray-700" />}
            {/* Dot */}
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 ${step.status === "approved" ? "bg-gray-900 border-emerald-500" : step.status === "pending" ? "bg-amber-500 border-amber-500 animate-pulse" : "bg-gray-800 border-gray-700"}`} />

            <div className="flex items-center justify-between group cursor-pointer">
              <div>
                <h4 className={`text-base font-medium transition-colors ${step.status === "waiting" ? "text-gray-600" : "text-white"}`}>{step.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{step.role}</p>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${step.status === "approved" ? "text-emerald-400 bg-emerald-400/10" : step.status === "pending" ? "text-amber-400 bg-amber-400/10" : "text-gray-600"}`}>{step.status}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// --- Design 5: Modern Grid Cards ---
const Design5 = () => (
  <div className="max-w-2xl mx-auto">
    <div className="grid grid-cols-2 gap-4">
      {STEPS.map((step, index) => (
        <div key={step.id} className={`p-4 rounded-2xl border-2 flex flex-col justify-between min-h-[140px] transition-all hover:-translate-y-1 hover:shadow-md ${step.status === "approved" ? "bg-white border-emerald-100" : step.status === "pending" ? "bg-white border-amber-100 ring-4 ring-amber-50" : "bg-gray-50 border-transparent opacity-60"}`}>
          <div className="flex justify-between items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === "approved" ? "bg-emerald-100 text-emerald-600" : step.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-gray-200 text-gray-400"}`}>
              <span className="font-bold text-lg">{index + 1}</span>
            </div>
            {step.status === "approved" && <Check size={20} className="text-emerald-500" />}
            {step.status === "pending" && <Clock size={20} className="text-amber-500" />}
          </div>

          <div className="mt-4">
            <h4 className="font-bold text-gray-900">{step.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{step.role}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            {step.approvers.length > 0 ? (
              <>
                <div className="flex -space-x-2">
                  {step.approvers.map((a) => (
                    <div key={a} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white text-[8px] flex items-center justify-center font-bold">
                      {a[0]}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">Approved</span>
              </>
            ) : (
              <span className="text-[10px] text-gray-400 italic">Pending assignment</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const APPROVAL_FLOW_DESIGNS = [
  { id: 1, name: "Vertical Elegant Timeline", Component: Design1 },
  { id: 2, name: "Horizontal Stepper Cards", Component: Design2 },
  { id: 3, name: "Compact Status Rows", Component: Design3 },
  { id: 4, name: "Dark Mode Subway Map", Component: Design4 },
  { id: 5, name: "Modern Grid Cards", Component: Design5 },
];
