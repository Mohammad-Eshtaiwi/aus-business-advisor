import { Control, Controller } from "react-hook-form";
import Select from "@/components/Select";
import FORM_INPUTS_CONFIG from "../constants/formInputsConfig.const";
import { FormValues } from "..";

interface RegionSelectProps {
  name: keyof FormValues;
  level: keyof typeof FORM_INPUTS_CONFIG;
  placeholder: string;
  isRequired?: boolean;
  control: Control<FormValues>;
  getRegionOptions: (
    level: keyof typeof FORM_INPUTS_CONFIG
  ) => Array<{ value: string; label: string }>;
  handleRegionChange: (
    value: string,
    level: keyof typeof FORM_INPUTS_CONFIG
  ) => void;
}

const RegionSelect = ({
  name,
  level,
  placeholder,
  isRequired = true,
  control,
  getRegionOptions,
  handleRegionChange,
}: RegionSelectProps) => (
  <Controller
    name={name}
    control={control}
    rules={{ required: isRequired }}
    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
      <div className="select-container">
        <Select
          {...field}
          value={value || ""}
          onChange={(newValue) => {
            onChange(newValue);
            handleRegionChange(newValue, level);
          }}
          options={getRegionOptions(level)}
          disabled={level !== "state" && !getRegionOptions(level).length}
          placeholder={placeholder}
          error={!!error}
        />
        {error && <span className="error-message">{error.message}</span>}
      </div>
    )}
  />
);

export default RegionSelect;

export const RegionSelects = [
  {
    name: "state",
    level: "state",
    placeholder: "Select a State...",
    isRequired: true,
  },
  {
    name: "sa4",
    level: "sa4",
    placeholder: "Select a SA4 Region...",
    isRequired: true,
  },
  {
    name: "sa3",
    level: "sa3",
    placeholder: "Select a SA3 Region...",
    isRequired: true,
  },
  {
    name: "sa2",
    level: "sa2",
    placeholder: "Select a SA2 Region...",
    isRequired: true,
  },
];
