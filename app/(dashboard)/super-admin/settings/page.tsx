import { Settings } from "lucide-react";

import CompanySettingsForm from "../../components/settings/CompanySettingsForm";
import InvoiceSettingsForm from "../../components/settings/InvoiceSettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-[#0B3954]
              text-white
            "
          >
            <Settings size={24} />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-slate-800
              "
            >
              Company Settings
            </h1>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Manage company information and invoice configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Company Information */}

      <CompanySettingsForm />

      {/* Invoice Settings */}

      <InvoiceSettingsForm />
    </div>
  );
}
