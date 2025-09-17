import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "..";
import { Dispatch } from "react";
import FORM_INPUTS_CONFIG from "../constants/formInputsConfig.const";
// @ts-expect-error: No types available for 'sdmx-json-parser'
import { SDMXParser } from "sdmx-json-parser";
import { C21_G08_SA2 } from "@/app/constants/absIndexes";
import { SuggestionsAction } from "../reducers/suggestionsReducer";

export const resetChildFields = (
  level: keyof typeof FORM_INPUTS_CONFIG,
  setValue: UseFormSetValue<FormValues>
) => {
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

export const onSubmit = async (
  data: FormValues,
  dispatch: Dispatch<SuggestionsAction>
) => {
  // Check if all required fields are filled
  if (!data.state || !data.sa4 || !data.sa3 || !data.sa2) {
    dispatch({
      type: "ERROR",
      payload: "Please fill in all required fields before submitting.",
    });
    return;
  }
  dispatch({ type: "SUBMIT" });

  try {
    const parser = new SDMXParser();
    await parser.getDatasets(C21_G08_SA2(data.sa2));

    const parsedData: { value: number; BPLP: string }[] = parser.getData();

    const ancpData = parsedData
      .filter((item) => item.value > 0)
      .reduce(
        (acc: Record<string, number>, item) => ({
          ...acc,
          [item.BPLP]: item.value,
        }),
        {}
      );

    delete ancpData["Total"];
    delete ancpData["Not stated"];

    const response = await fetch("/api/business-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ancestryData: ancpData }),
    });

    if (!response.ok) {
      alert("Google AI server is not responding due to high demand. Please try again later.");

      throw new Error(`API error: ${response.statusText}`);
    }

    const { suggestions } = await response.json();
    dispatch({ type: "SUCCESS", payload: suggestions });
  } catch (error) {
    console.error("Error:", error);

    dispatch({
      type: "ERROR",
      payload: "Failed to load business suggestions. Please try again.",
    });
  }
};
