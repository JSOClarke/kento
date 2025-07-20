import InvoiceCategories from "./InvoiceCategories";

const rowHeaders = [
  "Number",
  "Client",
  "Email",
  "Create Date",
  "End Date",
  "Amount",
];

export default function InvoiceTable() {
  return (
    <div className="main-container bg-[#F7F6F9] my-4 rounded-lg border border-gray-200">
      <div className="category-navigation">
        <InvoiceCategories />
      </div>
      <div className="table-container  p-2">
        <div className="flex items-center justify-between text-gray-700 text-sm font-medium">
          {rowHeaders.map((rh) => {
            return <div>{rh}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
