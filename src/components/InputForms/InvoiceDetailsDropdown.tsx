import type { UseFormRegister } from "react-hook-form";
import { useState } from "react";
import type { FormFields } from "../../types/types";
import { ChevronDown, CirclePlus } from "lucide-react";
import { ChevronUp } from "lucide-react";
import PointAtoB from "../PointAtoB";
import type { Trip } from "../../types/types";
import ItemCard from "../ItemCard";
type InvoiceDetailsDropdownProps = {
  register: UseFormRegister<FormFields>;
  setTrips: () => void;
  trips: Trip[];
  setCurrentTrip: () => void;
  currentTrip: Trip;
};

export default function InvoiceDetailsDropdown({
  register,
  setTrips,
  trips,
}: InvoiceDetailsDropdownProps) {
  const [isMyDetailsOpen, setIsMyDetailsOpen] = useState<boolean>(false);

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
          <div className="flex flex-col gap-2">
            {trips.map((trip, idx) => {
              return (
                <div className=" bg-[#F5F7FB] rounded-xl items-container p-2 text-sm">
                  {`Item ${idx + 1}`}
                  <ItemCard trip={trip} />
                  {/* <PointAtoB setTrips={setTrips} trips={trips} /> */}
                </div>
              );
            })}
            <PointAtoB setTrips={setTrips} trips={trips} />
          </div>
          <div className="flex flex-col gap-2 py-2">
            <div className="done">
              <button className="bg-[#325CFF] text-white rounded-xl px-4 py-2">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
