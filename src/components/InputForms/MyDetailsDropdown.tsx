import type { UseFormRegister } from "react-hook-form";
import { useState } from "react";
import type { FormFields } from "../../types/types";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
type MyDetailsDropdownProps = {
  register: UseFormRegister<FormFields>;
};

export default function MyDetailsDropdown({
  register,
}: MyDetailsDropdownProps) {
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
    </div>
  );
}
