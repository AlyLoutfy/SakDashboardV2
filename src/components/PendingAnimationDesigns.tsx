import React from "react";
import { motion } from "framer-motion";

// Mock Component Layout
const TabsContainer = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{title}</div>
    <div className="flex gap-6 border-b border-gray-100 pb-2 items-center">
      {children}
      <button className="text-xs font-bold uppercase tracking-wide text-gray-400">
        All <span className="ml-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">124</span>
      </button>
      <button className="text-xs font-bold uppercase tracking-wide text-gray-400">
        Approved <span className="ml-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">31</span>
      </button>
    </div>
  </div>
);

// Animation 1: Standard Opacity Fade (Lighter Base)
const Design1 = () => (
  <TabsContainer title="1. Lighter Opacity Pulse">
    <motion.button animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-xs font-bold uppercase tracking-wide text-amber-500 flex items-center gap-2">
      PENDING YOUR APPROVAL
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">7</span>
    </motion.button>
  </TabsContainer>
);

// Animation 2: Color Cycle (Light to Selected)
const Design2 = () => (
  <TabsContainer title="2. Light Amber to Dark">
    <motion.button
      animate={{ color: ["#fbbf24", "#d97706", "#fbbf24"] }} // amber-400 to amber-600
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="text-xs font-bold uppercase tracking-wide flex items-center gap-2"
    >
      PENDING YOUR APPROVAL
      <motion.span animate={{ borderColor: ["#fde68a", "#f59e0b", "#fde68a"], color: ["#b45309", "#78350f", "#b45309"] }} className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
        7
      </motion.span>
    </motion.button>
  </TabsContainer>
);

// Animation 3: Desaturated to Color
const Design3 = () => (
  <TabsContainer title="3. Gray to Amber">
    <motion.button
      animate={{ color: ["#9ca3af", "#f59e0b", "#9ca3af"] }} // gray-400 to amber-500
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="text-xs font-bold uppercase tracking-wide flex items-center gap-2"
    >
      PENDING YOUR APPROVAL
      <motion.span animate={{ backgroundColor: ["#f3f4f6", "#fef3c7", "#f3f4f6"], color: ["#6b7280", "#b45309", "#6b7280"] }} className="text-[10px] px-1.5 py-0.5 rounded-full border border-gray-200">
        7
      </motion.span>
    </motion.button>
  </TabsContainer>
);

// Animation 4: Soft Blink (Fast)
const Design4 = () => (
  <TabsContainer title="4. Soft Blink">
    <motion.button animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="text-xs font-bold uppercase tracking-wide text-amber-400 flex items-center gap-2">
      PENDING YOUR APPROVAL
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-500 border border-amber-200">7</span>
    </motion.button>
  </TabsContainer>
);

// Animation 5: Text vs Badge Offset
const Design5 = () => (
  <TabsContainer title="5. Offset Fade">
    <motion.button animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-xs font-bold uppercase tracking-wide text-amber-500 flex items-center gap-2">
      PENDING YOUR APPROVAL
      <motion.span
        animate={{ opacity: [1, 0.6, 1] }} // Inverse opacity rhythm
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200"
      >
        7
      </motion.span>
    </motion.button>
  </TabsContainer>
);

// Animation 6: Deep Breathing Color
const Design6 = () => (
  <TabsContainer title="6. Deep Breathing">
    <motion.button
      animate={{ color: ["#fcd34d", "#b45309", "#fcd34d"] }} // amber-300 to amber-700
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="text-xs font-bold uppercase tracking-wide flex items-center gap-2"
    >
      PENDING YOUR APPROVAL
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50/50 text-inherit border border-current opacity-80">7</span>
    </motion.button>
  </TabsContainer>
);

// Animation 7: Ghost Type (Very Light)
const Design7 = () => (
  <TabsContainer title="7. Ghost Type">
    <motion.button animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-xs font-bold uppercase tracking-wide text-amber-500 flex items-center gap-2">
      PENDING YOUR APPROVAL
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">7</span>
    </motion.button>
  </TabsContainer>
);

// Animation 8: Warning Pulse (Red-tinged)
const Design8 = () => (
  <TabsContainer title="8. Urgency Tint">
    <motion.button
      animate={{ color: ["#f59e0b", "#ef4444", "#f59e0b"] }} // amber to red
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="text-xs font-bold uppercase tracking-wide flex items-center gap-2"
    >
      PENDING YOUR APPROVAL
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-current border border-current opacity-80">7</span>
    </motion.button>
  </TabsContainer>
);

// Animation 9: Smooth Blur Fade
const Design9 = () => (
  <TabsContainer title="9. Blur & Fade">
    <motion.button animate={{ opacity: [0.5, 1, 0.5], filter: ["blur(0.5px)", "blur(0px)", "blur(0.5px)"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="text-xs font-bold uppercase tracking-wide text-amber-500 flex items-center gap-2">
      PENDING YOUR APPROVAL
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">7</span>
    </motion.button>
  </TabsContainer>
);

// Animation 10: Subtle Shimmer
const Design10 = () => (
  <TabsContainer title="10. Subtle Shimmer">
    <motion.button animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="text-xs font-bold uppercase tracking-wide text-amber-400 flex items-center gap-2">
      PENDING YOUR APPROVAL
      <motion.span animate={{ backgroundColor: ["#fffbeb", "#fef3c7", "#fffbeb"] }} className="text-[10px] px-1.5 py-0.5 rounded-full text-amber-600 border border-amber-100">
        7
      </motion.span>
    </motion.button>
  </TabsContainer>
);

export const PENDING_ANIMATION_DESIGNS = [
  { id: 1, name: "Lighter Opacity Pulse", Component: Design1 },
  { id: 2, name: "Light Amber to Dark", Component: Design2 },
  { id: 3, name: "Gray to Amber", Component: Design3 },
  { id: 4, name: "Soft Blink", Component: Design4 },
  { id: 5, name: "Offset Fade", Component: Design5 },
  { id: 6, name: "Deep Breathing", Component: Design6 },
  { id: 7, name: "Ghost Type", Component: Design7 },
  { id: 8, name: "Urgency Tint", Component: Design8 },
  { id: 9, name: "Blur & Fade", Component: Design9 },
  { id: 10, name: "Subtle Shimmer", Component: Design10 },
];
