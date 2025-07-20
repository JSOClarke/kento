import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import PrintView from "../components/PrintView";

type FormFields = {
  email: string;
  password: string;
};

export default function CreateInvoicePage() {
  const { register } = useForm<FormFields>();
  const [isMyDetailsOpen, setIsMyDetailsOpen] = useState<boolean>(false);

  function handleToggleDropdown(e) {
    e.preventDefault();
    setIsMyDetailsOpen((prev) => !prev);
  }
  return (
    <div className="main-container flex">
      <div className=" input-container flex-1 border-r border-gray-200 h-screen">
        <div className="title-container flex flex-col gap-2">
          <span className="text-lg font-semibold">Create New Invoice</span>
          <span className="text-sm font-medium">Fill in invoice details</span>
          <span className="text-sm text-gray-800">
            You can save unfinished invoices as a draft and complete later.
          </span>
        </div>
        <form className="pr-4 pt-4">
          <div className="border border-gray-200 rounded-sm flex flex-col p-2 gap-2">
            <div className="drop-down selector flex items-center justify-between text-gray-600">
              <div>My Details</div>
              <button onClick={(e) => handleToggleDropdown(e)}>
                {isMyDetailsOpen === false ? <ChevronDown /> : <ChevronUp />}
              </button>
            </div>
            {isMyDetailsOpen && (
              <input
                {...register("email")}
                type="text"
                placeholder="Email"
                className="px-2"
              />
            )}
          </div>
        </form>
      </div>
      <div className=" print-container bg-gray-100 flex-1 p-8">
        <PrintView />
      </div>
    </div>
  );
}
