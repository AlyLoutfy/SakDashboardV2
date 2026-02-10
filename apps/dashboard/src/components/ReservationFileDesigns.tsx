import React, { useState, useEffect } from "react";
import { Eye, FileText, Download, ChevronDown, Image as ImageIcon, Paperclip, X, ZoomIn, Lock, User, Check, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const MOCK_FILE = {
  name: "national_id_front.jpg",
  size: "2.4 MB",
  url: "https://via.placeholder.com/600x400?text=National+ID+Card",
  type: "image/jpeg",
};

// --- Mock Drawer Component ---
const MockDrawer = ({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/25 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Reservation #4835</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">Reserving</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Unit U-1023 • Sarah Miller • Today at 10:23 AM</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-100 flex gap-6 text-sm font-bold text-gray-500 bg-white">
          <button className="py-3 text-blue-600 border-b-2 border-blue-600">Details</button>
          <button className="py-3 hover:text-gray-800 transition-colors">Approval Flow</button>
          <button className="py-3 hover:text-gray-800 transition-colors">History</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Client</p>
              <p className="font-bold text-sm text-gray-800">Sarah Miller</p>
              <p className="text-xs text-gray-500">+201006262152</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Salesperson</p>
              <p className="font-bold text-sm text-gray-800">Raheem Moussa</p>
              <p className="text-xs text-gray-500">Sales Department</p>
            </div>
          </div>

          {/* Integration of the Design */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Reservation Form Response</h3>
              <span className="text-[10px] text-gray-400 italic">Using: {title}</span>
            </div>
            {/* We render the child design here. The child design usually is the "Form Response" card itself. */}
            <div className="w-full">{children}</div>
          </div>

          {/* Dummy Details to fill space */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm opacity-60 pointer-events-none">
            <h3 className="text-xs font-bold text-gray-900 mb-3">Unit Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Compound</span>
                <span>Zayed Dunes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span>3,500,000 EGP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-xl">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50" onClick={onClose}>
            Close
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100">Approve Request</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Wrapper for Designs ---
const PreviewWrapper = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* Inline Preview */}
      <div className="w-full max-w-md mx-auto transform transition-all hover:scale-[1.01]">{children}</div>

      {/* Drawer Trigger */}
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-lg shadow-gray-200 transition-all hover:shadow-xl active:scale-95">
        <FileText size={16} /> Preview in Drawer
      </button>

      {/* Actual Drawer */}
      <AnimatePresence>
        {isOpen && (
          <MockDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
            {children}
          </MockDrawer>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// DESIGNS
// =============================================================================

// 1. Classic List Item
const Design1 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Form Response</h3>
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600 font-medium">ID Upload</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          <ImageIcon size={14} />
          <span className="text-xs font-semibold underline decoration-blue-300 underline-offset-2">{MOCK_FILE.name}</span>
        </div>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <Download size={14} />
        </button>
      </div>
    </div>
    {/* Other Fields Dummy */}
    <div className="flex justify-between items-center py-2 border-b border-gray-100 opacity-60">
      <span className="text-xs text-gray-500">Email</span>
      <span className="text-xs font-semibold">sarah@example.com</span>
    </div>
  </div>
);

// 2. Button Trigger (Modal)
const Design2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Form Response</h3>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600 font-medium">ID Upload</span>
          <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">
            <Eye size={14} /> View Document
          </button>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-gray-50 opacity-60">
          <span className="text-xs text-gray-500">Nationality</span>
          <span className="text-xs font-semibold">Egyptian</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">ID Document Preview</h3>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 bg-gray-50 flex justify-center">
              <div className="aspect-video w-full bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-400 font-bold text-lg">OFFICIAL ID IMAGE PREVIEW</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 3. Accordion Expand
const Design3 = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full transition-all">
      <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">ID Verification</h3>
          <p className="text-xs text-gray-400 mt-0.5">Click to reveal documents</p>
        </div>
        <div className={`p-1 rounded-full bg-gray-100 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <div className="aspect-[3/2] bg-gray-200 rounded flex items-center justify-center text-xs font-mono text-gray-500">ID CARD IMAGE</div>
                <div className="mt-2 flex justify-between items-center px-1">
                  <span className="text-[10px] text-gray-500">{MOCK_FILE.name}</span>
                  <span className="text-[10px] font-bold text-gray-400">{MOCK_FILE.size}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 4. Thumbnail Grid
const Design4 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Attachments</h3>
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="group relative aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-blue-400 transition-all">
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:bg-black/5 transition-colors">
            <ImageIcon size={20} />
          </div>
          {i === 1 && <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white" />}
        </div>
      ))}
    </div>
  </div>
);

// 5. Featured Card
const Design5 = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full group">
    <div className="aspect-[21/9] bg-gradient-to-br from-indigo-100 to-purple-100 relative items-center justify-center flex">
      <div className="text-indigo-300 group-hover:scale-110 transition-transform duration-500">
        <ImageIcon size={48} />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button className="px-4 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-full shadow-lg hover:scale-105 transition-transform">Preview</button>
      </div>
    </div>
    <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center">
      <div>
        <p className="text-xs font-bold text-gray-800">National ID Scan</p>
        <p className="text-[10px] text-gray-400">Added just now</p>
      </div>
      <button className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700 rounded-lg">
        <Download size={14} />
      </button>
    </div>
  </div>
);

// 6. Split View
const Design6 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Identity Proof</h3>
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 shrink-0">
        <ImageIcon size={24} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center border-b border-gray-50 pb-1">
          <span className="text-xs text-gray-500">Document Type</span>
          <span className="text-xs font-bold text-gray-800">Passport</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-50 pb-1">
          <span className="text-xs text-gray-500">Number</span>
          <span className="text-xs font-bold text-gray-800">A0987123</span>
        </div>
        <div className="pt-1">
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-7 text-xs rounded-lg font-bold transition-colors">Verify Document</button>
        </div>
      </div>
    </div>
  </div>
);

// 7. Hover Reveal (Blur)
const Design7 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
      <Lock size={12} /> Encrypted Attachment
    </h3>
    <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer border border-gray-200">
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md group-hover:bg-white/10 group-hover:backdrop-blur-0 transition-all duration-500 z-10 p-4">
        <div className="text-center group-hover:opacity-0 transition-opacity">
          <Eye size={20} className="mx-auto text-gray-400 mb-1" />
          <span className="text-xs font-bold text-gray-500">Hover to Reveal ID</span>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-300 font-bold text-2xl tracking-tighter">ID CARD 123</div>
    </div>
  </div>
);

// 8. Chip List (Minimal)
const Design8 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-medium text-gray-700">Uploaded Documents:</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {["ID Front.jpg", "ID Back.jpg", "Selfie.png"].map((file) => (
        <div key={file} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full cursor-pointer transition-colors group">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">{file}</span>
          <X size={12} className="text-gray-400 hover:text-red-500 ml-1" />
        </div>
      ))}
      <button className="px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-xs font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1 hover:border-gray-400">
        <Paperclip size={12} /> Attach
      </button>
    </div>
  </div>
);

// 9. Floating Action (Modern)
const Design9 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm w-full relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">Pending Review</div>
        <div className="text-lg font-bold text-gray-900">National ID</div>
        <div className="text-xs text-gray-500 mt-1">Uploaded by Client • 2h ago</div>
      </div>
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
        <FileText size={20} />
      </div>
    </div>
    <div className="mt-6 flex gap-2">
      <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-2 transition-colors">
        <Eye size={14} /> View
      </button>
      <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-2 transition-colors">
        <Download size={14} /> Download
      </button>
    </div>
  </div>
);

// 10. Zoom Preview
const Design10 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">High Res Preview</h3>
    <div className="relative aspect-[3/1] bg-gray-800 rounded-lg overflow-hidden group cursor-zoom-in">
      <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur rounded-full p-2 group-hover:scale-125 transition-transform">
          <ZoomIn size={20} className="text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
        <span className="text-white text-[10px] font-mono">IMG_SCAN_2026.JPG</span>
      </div>
    </div>
  </div>
);

// --- Wrap Exports ---
export const RESERVATION_FILE_DESIGNS = [
  {
    id: 1,
    name: "Classic List Link",
    Component: () => (
      <PreviewWrapper title="Classic List Link">
        <Design1 />
      </PreviewWrapper>
    ),
  },
  {
    id: 2,
    name: "Modal Trigger",
    Component: () => (
      <PreviewWrapper title="Modal Trigger">
        <Design2 />
      </PreviewWrapper>
    ),
  },
  {
    id: 3,
    name: "Accordion Reveal",
    Component: () => (
      <PreviewWrapper title="Accordion Reveal">
        <Design3 />
      </PreviewWrapper>
    ),
  },
  {
    id: 4,
    name: "Thumbnail Grid",
    Component: () => (
      <PreviewWrapper title="Thumbnail Grid">
        <Design4 />
      </PreviewWrapper>
    ),
  },
  {
    id: 5,
    name: "Featured Card",
    Component: () => (
      <PreviewWrapper title="Featured Card">
        <Design5 />
      </PreviewWrapper>
    ),
  },
  {
    id: 6,
    name: "Split Data View",
    Component: () => (
      <PreviewWrapper title="Split Data View">
        <Design6 />
      </PreviewWrapper>
    ),
  },
  {
    id: 7,
    name: "Hover Security",
    Component: () => (
      <PreviewWrapper title="Hover Security">
        <Design7 />
      </PreviewWrapper>
    ),
  },
  {
    id: 8,
    name: "Minimal Chip List",
    Component: () => (
      <PreviewWrapper title="Minimal Chip List">
        <Design8 />
      </PreviewWrapper>
    ),
  },
  {
    id: 9,
    name: "Modern Action Card",
    Component: () => (
      <PreviewWrapper title="Modern Action Card">
        <Design9 />
      </PreviewWrapper>
    ),
  },
  {
    id: 10,
    name: "Zoom Preview Header",
    Component: () => (
      <PreviewWrapper title="Zoom Preview Header">
        <Design10 />
      </PreviewWrapper>
    ),
  },
];
