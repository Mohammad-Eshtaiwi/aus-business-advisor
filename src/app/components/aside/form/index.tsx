"use client";

import React from "react";
import Select from "@/components/Select";
import * as RadixForm from "@radix-ui/react-form";
import { useRegions } from "@/app/context/RegionsContext";
import { useForm, Controller } from "react-hook-form";
import { SA2Region, SA3Region, SA4Region } from "@/app/types/regions";
import { SA2_URL, SA3_URL, SA4_URL, STE_URL } from "@/app/constants/layers";
import { useMap, addFeatureLayer } from "@/components/Map/Provider";
import handleLocationClick from "./utils/handleLocationClick";

export interface FormValues {
  state: string;
  sa4: string;
  sa3: string;
  sa2: string;
}

interface SelectOption {
  value: string;
  label: string;
}

function Form() {
  const { watch, control, handleSubmit, setValue, getValues } =
    useForm<FormValues>({
      defaultValues: {
        state: "",
        sa4: "",
        sa3: "",
        sa2: "",
      },
    });
  const { regions } = useRegions();
  const { map, view } = useMap();

  const state = watch("state");
  const sa4 = watch("sa4");
  const sa3 = watch("sa3");

  const onSubmit = (data: FormValues) => {
    // Handle form submission
    console.log("Form submitted with data:", data);
  };

  const resetChildFields = (level: "state" | "sa4" | "sa3") => {
    if (level === "state") {
      setValue("sa4", "");
      setValue("sa3", "");
      setValue("sa2", "");
    } else if (level === "sa4") {
      setValue("sa3", "");
      setValue("sa2", "");
    } else if (level === "sa3") {
      setValue("sa2", "");
    }
  };

  const handleRegionChange = async (
    value: string,
    level: "state" | "sa4" | "sa3" | "sa2",
    {
      shouldAddLayer = true,
    }: {
      shouldAddLayer?: boolean;
    } = {}
  ) => {
    const config = {
      state: { url: STE_URL, codeField: "state_code_2021" },
      sa4: { url: SA4_URL, codeField: "sa4_code_2021" },
      sa3: { url: SA3_URL, codeField: "sa3_code_2021" },
      sa2: { url: SA2_URL, codeField: "sa2_code_2021" },
    }[level];

    if (map && view && shouldAddLayer) {
      await addFeatureLayer({ ...config, code: value }, map, view);
    }
    if (level !== "sa2") {
      resetChildFields(level);
    }
  };

  const getRegionOptions = (
    level: "state" | "sa4" | "sa3" | "sa2"
  ): SelectOption[] => {
    const options = {
      state: regions.states.map((state) => ({
        value: state.state_code_2021,
        label: state.state_name_2021,
      })),
      sa4:
        regions.sa4?.[state]?.map((region: SA4Region) => ({
          value: region.sa4_code_2021,
          label: region.sa4_name_2021,
        })) || [],
      sa3:
        regions.sa3?.[sa4!]?.map((region: SA3Region) => ({
          value: region.sa3_code_2021,
          label: region.sa3_name_2021,
        })) || [],
      sa2:
        regions.sa2?.[sa3!]?.map((region: SA2Region) => ({
          value: region.sa2_code_2021,
          label: region.sa2_name_2021,
        })) || [],
    };

    return options[level];
  };

  const renderRegionSelect = (
    name: keyof FormValues,
    level: "state" | "sa4" | "sa3" | "sa2",
    placeholder: string,
    isRequired = false
  ) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      render={({ field: { value, onChange, ...field } }) => (
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
        />
      )}
    />
  );

  return (
    <RadixForm.Root className="FormRoot" onSubmit={handleSubmit(onSubmit)}>
      <button
        type="button"
        className="Button location-button"
        onClick={() => handleLocationClick(setValue, handleRegionChange)}
        style={{ marginBottom: "1rem" }}
      >
        📍 Use My Location
      </button>

      {renderRegionSelect("state", "state", "Select a State...", true)}
      {renderRegionSelect("sa4", "sa4", "Select a SA4 Region...")}
      {renderRegionSelect("sa3", "sa3", "Select a SA3 Region...")}
      {renderRegionSelect("sa2", "sa2", "Select a SA2 Region...")}

      <button type="submit" className="Button">
        Get Statistics
      </button>
    </RadixForm.Root>
  );
}

export default Form;
