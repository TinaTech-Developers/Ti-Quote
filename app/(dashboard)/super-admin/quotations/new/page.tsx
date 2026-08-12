import QuotationForm from "../../../components/quotations/QuotationForm";

export default function NewQuotationPage() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <h1 className="text-2xl font-bold">
          Create New Quotation
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a quotation for your client with products and services.
        </p>
      </div>


      {/* Form */}

      <QuotationForm />

    </div>
  );
}