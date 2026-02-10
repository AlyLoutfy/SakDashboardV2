import { useRef } from "react";
import { motion } from "framer-motion";
import { Printer, Download, Building2, User, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentPlan, Installment } from "../../store/paymentPlansStore";
import { formatCurrency, formatDate, calculatePlanSummary } from "../../store/paymentPlansStore";
import { InstallmentRowCompact } from "./InstallmentRow";

interface PaymentPlanTemplateProps {
  plan: PaymentPlan;
  onUpdatePlan: (updates: Partial<PaymentPlan>) => void;
  onUpdateInstallment: (id: string, updates: Partial<Installment>) => void;
}

const PaymentPlanTemplate = ({ plan, onUpdatePlan, onUpdateInstallment: _onUpdateInstallment }: PaymentPlanTemplateProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const summary = calculatePlanSummary(plan);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Payment Plan Preview</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-2 text-gray-600">
            <Printer size={16} />
            Print
          </Button>
          <Button variant="secondary" size="sm" className="gap-2 text-gray-600">
            <Download size={16} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Template Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div ref={printRef} className="max-w-[800px] mx-auto bg-white shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white print:bg-emerald-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Building2 size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Sakneen</h1>
                  <p className="text-emerald-100 text-sm">Real Estate Development</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Payment Plan</p>
                <p className="text-xl font-bold">#{plan.id.slice(-6).toUpperCase()}</p>
                <p className="text-emerald-100 text-sm mt-1">{formatDate(plan.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Client & Unit Info */}
          <div className="grid grid-cols-2 gap-6 p-8 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <User size={16} />
                <span className="text-xs uppercase tracking-wide font-medium">Client Information</span>
              </div>
              <div className="space-y-2">
                <input type="text" value={plan.clientName} onChange={(e) => onUpdatePlan({ clientName: e.target.value })} placeholder="Client Name" className="w-full text-lg font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors pb-1" />
                <textarea placeholder="Add client notes..." value={plan.notes} onChange={(e) => onUpdatePlan({ notes: e.target.value })} className="w-full text-sm text-gray-600 bg-transparent border border-transparent rounded hover:border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors p-1 resize-none" rows={2} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <MapPin size={16} />
                <span className="text-xs uppercase tracking-wide font-medium">Property Details</span>
              </div>
              <div className="space-y-2">
                <input type="text" value={plan.unitCode} onChange={(e) => onUpdatePlan({ unitCode: e.target.value })} placeholder="Unit Code" className="w-full text-lg font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors pb-1" />
                <p className="text-sm text-gray-500">Property Unit</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-8 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Financial Summary</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Price</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.priceAfterDiscount)}</p>
                {summary.discountAmount > 0 && <p className="text-xs text-amber-600">-{formatCurrency(summary.discountAmount)} discount</p>}
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Down Payment</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(summary.downPaymentAmount)}</p>
                <p className="text-xs text-gray-400">{summary.downPaymentPercent.toFixed(1)}%</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">To Be Financed</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.remainingToFinance)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-xl font-bold text-gray-900">{summary.durationYears.toFixed(1)} years</p>
                <p className="text-xs text-gray-400">{summary.installmentCount} payments</p>
              </div>
            </div>
          </div>

          {/* Installments Table */}
          <div className="p-8">
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <FileText size={16} />
              <span className="text-xs uppercase tracking-wide font-medium">Payment Schedule</span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.installments.map((installment) => (
                    <InstallmentRowCompact key={installment.id} installment={installment} />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                    <td className="py-4 px-4 font-semibold text-gray-900" colSpan={1}>
                      Total
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-700 text-lg">{formatCurrency(summary.totalInstallmentsCreated)}</td>
                    <td colSpan={3} className="py-4 px-4 text-gray-500 text-sm">
                      {summary.installmentCount} installments over {summary.durationMonths} months
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-8 bg-gray-50 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Terms & Conditions</h3>
            <div className="text-xs text-gray-600 space-y-2">
              <p>1. All payments are due on the specified dates. Late payments may incur additional charges.</p>
              <p>2. This payment plan is subject to the terms and conditions of the purchase agreement.</p>
              <p>3. The company reserves the right to modify payment terms with prior notice.</p>
              <p>4. All amounts are in Egyptian Pounds (EGP).</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 p-8 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-12">Client Signature</p>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm text-gray-600">{plan.clientName || "Client Name"}</p>
                <p className="text-xs text-gray-400">Date: _________________</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-12">Company Representative</p>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm text-gray-600">Authorized Signatory</p>
                <p className="text-xs text-gray-400">Date: _________________</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 text-white p-6 text-center">
            <p className="text-sm">Sakneen Real Estate Development</p>
            <p className="text-xs text-gray-400 mt-1">www.sakneen.com | info@sakneen.com | +20 xxx xxx xxxx</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PaymentPlanTemplate;
