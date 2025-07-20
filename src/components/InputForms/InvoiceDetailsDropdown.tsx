import type { UseFormRegister } from "react-hook-form";
import { useState } from "react";
import type { FormFields } from "../../types/types";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import PointAtoB from "../PointAtoB";
import type { Trip } from "../../types/types";
type InvoiceDetailsDropdownProps = {
  register: UseFormRegister<FormFields>;
};

export default function InvoiceDetailsDropdown({
  register,
}: InvoiceDetailsDropdownProps) {
  const [isMyDetailsOpen, setIsMyDetailsOpen] = useState<boolean>(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState({
    startAddr: "",
    endAddr: "",
    distance: 0,
    duration: 0,
    price: 0,
  });

  function handleToggleDropdown(e) {
    e.preventDefault();
    setIsMyDetailsOpen((prev: boolean) => !prev);
  }
  return (
    <div className="border border-gray-200 rounded-sm flex flex-col ">
      <div
        className={`drop-down selector flex items-center justify-between text-gray-600 p-2 ${
          isMyDetailsOpen && "border-b border-gray-200"
        }`}
      >
        <div>Invoice Details</div>

        <button onClick={(e) => handleToggleDropdown(e)}>
          {isMyDetailsOpen === false ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronUp size={20} />
          )}
        </button>
      </div>
      {isMyDetailsOpen && (
        <div className="flex flex-col  justify-between text-gray-600 p-2 gap-2 ">
          <label className="text-sm">Issued Date</label>
          <input
            {...register("issuedDate")}
            type="text"
            placeholder="19/20/20"
            className=" p-2 border border-gray-200 rounded-xl"
          />
          <div className=" bg-[#F5F7FB] rounded-xl items-container p-2 text-sm">
            Item 1
            <PointAtoB setTrips={setTrips} setCurrentTrip={setCurrentTrip} />
          </div>
        </div>
      )}
    </div>
  );
}
