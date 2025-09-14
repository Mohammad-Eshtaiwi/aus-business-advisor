"use client";

import React, { useReducer } from "react";
import * as RadixForm from "@radix-ui/react-form";
import { useRegions } from "@/app/context/RegionsContext";
import { useForm } from "react-hook-form";
import { addFeatureLayer, useMap } from "@/components/Map/Provider";
import handleLocationClick from "./utils/handleLocationClick";
import ReactMarkdown from "react-markdown";
import Modal from "@/components/modal";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import FORM_INPUTS_CONFIG from "./constants/formInputsConfig.const";
import FORM_DEFAULT_VALUES from "./constants/formDefaultValues.const";
import { onSubmit, resetChildFields } from "./utils/commonFormFunctionalities";
import RegionSelect, { RegionSelects } from "./components/RegionSelect";
import {
  suggestionsReducer,
  initialState,
} from "./reducers/suggestionsReducer";
import { SA2Region, SA3Region, SA4Region } from "@/app/types/regions";

export type FormValues = {
  state: string | null;
  sa4: string | null;
  sa3: string | null;
  sa2: string | null;
};

interface SelectOption {
  value: string;
  label: string;
}

function Form() {
  const { watch, control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: FORM_DEFAULT_VALUES,
  });
  const { regions } = useRegions();
  const { map, view } = useMap();

  const state = watch("state");
  const sa4 = watch("sa4");
  const sa3 = watch("sa3");

  const [suggestionsState, dispatch] = useReducer(
    suggestionsReducer,
    initialState
  );

  const handleRegionChange = async (
    value: string,
    level: keyof typeof FORM_INPUTS_CONFIG,
    {
      shouldAddLayer = true,
    }: {
      shouldAddLayer?: boolean;
    } = {}
  ) => {
    const config = FORM_INPUTS_CONFIG[level];

    if (map && view && shouldAddLayer) {
      await addFeatureLayer({ ...config, code: value }, map, view);
    }
    if (level !== "sa2") {
      resetChildFields(level, setValue);
      // Reset suggestions when changing higher-level regions
      dispatch({ type: "RESET" });
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
        regions.sa4?.[state!]?.map((region: SA4Region) => ({
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

  return (
    <RadixForm.Root
      className="FormRoot"
      onSubmit={handleSubmit((data) => onSubmit(data, dispatch))}
    >
      <button
        type="button"
        className="Button location-button"
        onClick={() => handleLocationClick(setValue, handleRegionChange)}
        style={{ marginBottom: "1rem" }}
      >
        📍 Use My Location
      </button>

      {RegionSelects.map((regionSelect) => (
        <RegionSelect
          key={regionSelect.name}
          name={regionSelect.name as keyof FormValues}
          level={regionSelect.level as keyof typeof FORM_INPUTS_CONFIG}
          placeholder={regionSelect.placeholder}
          control={control}
          getRegionOptions={getRegionOptions}
          handleRegionChange={handleRegionChange}
        />
      ))}

      <Modal
        trigger={
          <button
            type="submit"
            className="Button"
            disabled={suggestionsState.isLoading}
          >
            {suggestionsState.isLoading ? "Loading..." : "Get Statistics"}
          </button>
        }
        title="Business Suggestions"
      >
        <div>
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              {suggestionsState.error ? (
                <div className="error-message">{suggestionsState.error}</div>
              ) : (
                <ReactMarkdown className="markdown">
                  {suggestionsState.suggestions}
                </ReactMarkdown>
              )}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="ScrollAreaScrollbar"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="ScrollAreaThumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="ScrollAreaCorner" />
          </ScrollArea.Root>
        </div>
      </Modal>
    </RadixForm.Root>
  );
}

export default Form;
