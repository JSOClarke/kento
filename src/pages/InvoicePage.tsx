import InvoiceTable from "../components/Invoice/InvoiceTable";

export default function InvoicePage() {
  return (
    <div className="container">
      <div className="top-section flex items-center justify-between border-b border-gray-200 pb-4 ">
        <div className="font-inter text-xl font-semibold">Invoices</div>
        <button className="bg-[#325EFF] text-white text-xs rounded-sm px-4 py-2">
          Create New Invoice
        </button>
      </div>
      <div className="middle-section flex-1">
        <InvoiceTable />
      </div>
    </div>
  );
}
