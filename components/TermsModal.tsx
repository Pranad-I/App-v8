'use client';

export function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[#1a2a3e] bg-[#050b14] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#c8ddf0]">Terms &amp; Conditions</h2>
          <button onClick={onClose} className="text-[#607089] hover:text-[#c8ddf0]" aria-label="Close">✕</button>
        </div>
        <div className="space-y-3 text-[13px] leading-relaxed text-[#8ea8c9]">
          <p>
            By creating an account with MLaNDS (Intelligent Multi-Layer Network Defence System), you agree
            to use this service responsibly and only on networks and devices you own or are authorized to
            monitor and manage.
          </p>
          <p>
            <strong className="text-[#b6d0ee]">1. Acceptable use.</strong> You will not use this platform to
            monitor, access, or interfere with any network or device without proper authorization.
          </p>
          <p>
            <strong className="text-[#b6d0ee]">2. Account security.</strong> You are responsible for keeping
            your login credentials confidential and for all activity that occurs under your account.
          </p>
          <p>
            <strong className="text-[#b6d0ee]">3. Data handling.</strong> Device and network activity data
            you generate is stored to provide the dashboard, alerting, and history features of this service.
          </p>
          <p>
            <strong className="text-[#b6d0ee]">4. No warranty.</strong> This software is provided as-is,
            without warranty of any kind, express or implied.
          </p>
          <p>
            <strong className="text-[#b6d0ee]">5. Changes.</strong> These terms may be updated from time to
            time; continued use of the service constitutes acceptance of the current terms.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-md bg-[#0f7fff] py-2 text-sm font-semibold text-white hover:bg-[#0560d1]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
