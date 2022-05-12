/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Button } from "@components";
import { Role } from "@types";
import { useState } from "react";
import Select from "react-select";

type Props = {
  onSubmit: (inputValue: Role) => Promise<void>;
};

export const SelectForm: React.FunctionComponent<Props> = ({ onSubmit }) => {
  const options = [
    { value: "Consumer", label: "Consumer" },
    { value: "Distributor", label: "Distributor" },
    { value: "Farmer", label: "Farmer" },
    { value: "Retailer", label: "Retailer" },
  ];
  const [selectedValue, setSelectedValue] = useState<Role>();
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    selectedValue && onSubmit(selectedValue);
  };
  return (
    <form className="my-5" onSubmit={handleSubmit}>
      <h2 className="text-bold text-xl uppercase mb-2">Select role</h2>
      <div className="flex">
        <Select options={options} onChange={(e: any) => setSelectedValue(e.value)} />
        <Button classes="ml-2" disabled={selectedValue === undefined} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
