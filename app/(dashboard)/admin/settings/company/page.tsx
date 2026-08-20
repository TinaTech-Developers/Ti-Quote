import CompanySettingsForm from "../../components/settings/CompanySettingsForm";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function CompanySettingsPage() {
  const user = await requirePermission("settings.view");

  const company = await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
    include: {
      settings: true,
    },
  });

  if (!company) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Company not found
        </h2>

        <p className="mt-1 text-sm text-red-600">
          We could not find the company associated with your account.
        </p>
      </div>
    );
  }

  const serializedCompany = {
    id: company.id,
    name: company.name,
    email: company.email,
    phone: company.phone,
    address: company.address,
    website: company.website,
    logoUrl: company.logoUrl,
    taxNumber: company.taxNumber,
    currency: company.currency,

    settings:
      company.settings ?
        {
          id: company.settings.id,
          companyId: company.settings.companyId,
          quotationPrefix: company.settings.quotationPrefix,
          invoicePrefix: company.settings.invoicePrefix,
          paymentPrefix: company.settings.paymentPrefix,
          quotationCounter: company.settings.quotationCounter,
          invoiceCounter: company.settings.invoiceCounter,
          paymentCounter: company.settings.paymentCounter,
          defaultTax: Number(company.settings.defaultTax),
        }
      : null,
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Company Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your company information, contact details and business
          information.
        </p>
      </div>

      {/* FORM */}

      <CompanySettingsForm company={serializedCompany} />
    </div>
  );
}
