"use client";
import { useState, useRef } from "react";
import { X, Car, MapPin, Phone } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; message: string; step: number }> = {
  new:       { label: "Received",   message: "We've got your vehicle on our schedule. We'll review it shortly and reach out with any questions.", step: 1 },
  reviewing: { label: "Reviewing",  message: "Our technician is reviewing your vehicle now. We'll have a diagnosis and estimate for you soon.", step: 2 },
  in_repair: { label: "In Repair",  message: "Your vehicle is in the bay — our team is actively working on it. We'll call when it's ready.", step: 3 },
  ready:     { label: "Ready!",     message: "Your vehicle is ready for pickup! Stop by anytime during business hours.", step: 4 },
  completed: { label: "Completed",  message: "Service complete. Thank you for choosing Triple Crown Automotive!", step: 4 },
};

const ACTIVE_STATUSES = ["new", "reviewing", "in_repair", "ready"];

interface TicketResult {
  ticket_number: string;
  status: string;
  notes?: string;
}

type Phase = "lookup" | "loading" | "found" | "not_found";

export function TrackRepairModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("lookup");
  const [ticketId, setTicketId] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState<TicketResult | null>(null);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function buildParams(id: string, ph: string) {
    return new URLSearchParams({
      ticket_number: id.trim().toUpperCase(),
      phone:         ph.trim(),
      shop_id:       process.env.NEXT_PUBLIC_SHOP_ID ?? "triple-crown-automotive",
    });
  }

  async function lookup() {
    if (!ticketId.trim() || !phone.trim()) {
      setError("Please enter your ticket number and phone.");
      return;
    }
    setError("");
    setPhase("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/tickets/status?${buildParams(ticketId, phone)}`
      );
      const json = await res.json();
      if (!res.ok) { setPhase("not_found"); return; }
      const data: TicketResult = json.data ?? json;
      setTicket(data);
      setPhase("found");
      if (ACTIVE_STATUSES.includes(data.status)) {
        pollRef.current = setInterval(async () => {
          try {
            const r2 = await fetch(
              `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/tickets/status?${buildParams(ticketId, phone)}`
            );
            const d2 = await r2.json();
            if (r2.ok) setTicket(d2.data ?? d2);
          } catch { /* non-fatal poll failure */ }
        }, 20000);
      }
    } catch {
      setPhase("not_found");
    }
  }

  function reset() {
    setPhase("lookup");
    setTicketId("");
    setPhone("");
    setTicket(null);
    if (pollRef.current) clearInterval(pollRef.current);
  }

  const config = ticket ? (STATUS_MAP[ticket.status] ?? { label: ticket.status, message: "", step: 1 }) : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a0a0a] px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-white font-black uppercase tracking-wider text-base">Track Your Repair</div>
            <div className="text-neutral-400 text-xs font-mono mt-0.5">Triple Crown Automotive</div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6">
          {phase === "lookup" && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">Enter your ticket number (from your confirmation email) and your phone number.</p>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1 block">Ticket Number</label>
                <input
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  placeholder="TCA-1234567890"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/40"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(530) 555-0100"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/40"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button onClick={lookup}
                className="w-full py-3 bg-[#0D5C3A] text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-[#0B4A2F] transition-colors">
                Look Up Ticket
              </button>
            </div>
          )}

          {phase === "loading" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-8 h-8 border-2 border-[#0D5C3A] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-neutral-500 font-mono">Looking up your ticket…</p>
            </div>
          )}

          {phase === "not_found" && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-bold mb-2">Ticket Not Found</div>
                <p className="text-sm text-neutral-500">We couldn&apos;t find a ticket matching that number and phone. Please double-check your confirmation email.</p>
              </div>
              <button onClick={reset}
                className="w-full py-3 border border-neutral-200 text-sm font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
                Try Again
              </button>
              <div className="text-center">
                <a href="tel:5306626995" className="text-[#0D5C3A] text-sm font-mono hover:underline">(530) 662-6995</a>
              </div>
            </div>
          )}

          {phase === "found" && ticket && config && (
            <div className="space-y-5">
              {/* Ticket number */}
              <div className="flex items-center gap-3 text-sm">
                <Car className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <div className="font-mono font-semibold tracking-wide">{ticket.ticket_number}</div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1">
                {["Received", "Reviewing", "In Repair", "Ready"].map((step, i) => {
                  const stepNum = i + 1;
                  const done = config.step >= stepNum;
                  const active = config.step === stepNum;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`flex flex-col items-center flex-1 ${i > 0 ? "" : ""}`}>
                        {i > 0 && <div className={`h-0.5 w-full mb-1 ${done ? "bg-[#0D5C3A]" : "bg-neutral-200"}`} />}
                        <div className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                          done ? "bg-[#0D5C3A] text-white" : "bg-neutral-200 text-neutral-400"
                        }`}>{stepNum}</div>
                        <div className={`text-[9px] font-mono uppercase tracking-wide mt-1 ${active ? "text-[#0D5C3A]" : "text-neutral-400"}`}>{step}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status message */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${ACTIVE_STATUSES.includes(ticket.status) ? "bg-[#0D5C3A] animate-pulse" : "bg-neutral-400"}`} />
                  <span className="font-black uppercase tracking-wide text-sm">{config.label}</span>
                </div>
                <p className="text-sm text-neutral-600">{config.message}</p>
              </div>

              {/* Shop note */}
              {ticket.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <div className="font-semibold mb-1 text-xs uppercase tracking-widest font-mono">Note from the shop</div>
                  {ticket.notes}
                </div>
              )}

              {/* Shop info */}
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm text-neutral-500">
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />320 Kentucky Ave, Woodland, CA 95695</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />
                  <a href="tel:5306626995" className="text-[#0D5C3A] hover:underline">(530) 662-6995</a>
                </div>
              </div>

              <button onClick={reset}
                className="w-full py-2.5 border border-neutral-200 text-sm text-neutral-500 rounded-lg hover:bg-neutral-50 transition-colors font-mono">
                Look Up Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
