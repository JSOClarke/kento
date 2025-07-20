import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Trip } from "../types/types";

import PrintView from "../components/PrintView";
import MyDetailsDropdown from "../components/InputForms/MyDetailsDropdown";
import InvoiceDetailsDropdown from "../components/InputForms/InvoiceDetailsDropdown";
import { nanoid } from "nanoid";
type FormFields = {
  email: string;
  password: string;
};

const initalTrip: Trip = {
  id: nanoid(),
  startAddr: "",
  endAddr: "",
  distance: 0,
  duration: 0,
  price: 0.0,
  mpg: 40,
  pricePerLitre: 1.45,
  hourlyRate: 15,
};

export default function CreateInvoicePage() {
  const { register } = useForm<FormFields>();
  const [trips, setTrips] = useState<Trip[]>([initalTrip]);

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
          {/* <div className="border border-gray-200 rounded-sm flex flex-col ">
            <div
              className={`drop-down selector flex items-center justify-between text-gray-600 p-2 ${
                isMyDetailsOpen && "border-b border-gray-200"
              }`}
            >
              <div>My Details</div>

              <button onClick={(e) => handleToggleDropdown(e)}>
                {isMyDetailsOpen === false ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronUp size={20} />
                )}
              </button>
            </div>
            {isMyDetailsOpen && (
              <input
                {...register("email")}
                type="text"
                placeholder="Email"
                className="p-2"
              />
            )}
          </div> */}
          <div className="pb-2">
            <MyDetailsDropdown register={register} />
          </div>
          <div className="pb-2">
            <InvoiceDetailsDropdown
              register={register}
              setTrips={setTrips}
              trips={trips}
            />
          </div>
        </form>
      </div>
      <div className=" print-container bg-[#F5F7FB] flex-1 p-8">
        <PrintView />
      </div>
    </div>
  );
}
