// app/api/regions/route.ts
import { NextResponse } from "next/server";
import groupBy from "lodash/groupBy";
import Graphic from "@arcgis/core/Graphic";
import { BASE_URL } from "@/app/constants/layers";

const DEFAULT_PARAMS = "where=1=1&returnGeometry=false&f=json";

export async function fetchLayer(
  layer: string,
  options: { outFields?: string; extraParams?: string } = {}
): Promise<InstanceType<typeof Graphic>[][number]["attributes"]> {
  const { outFields = "*", extraParams = "" } = options;

  const url =
    `${BASE_URL}/${layer}/MapServer/0/query?${DEFAULT_PARAMS}` +
    `&outFields=${outFields}${extraParams}`;

  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to fetch ${layer}`);

  const data: { features: InstanceType<typeof Graphic>[] } = await res.json();
  return data.features.map((f) => f.attributes);
}

/** Fetch states */
async function fetchStates() {
  return fetchLayer("STE", { outFields: "state_code_2021,state_name_2021" });
}

/** Fetch SA4 grouped by state */
async function fetchSA4() {
  const sa4 = await fetchLayer("SA4", {
    outFields: "sa4_code_2021,sa4_name_2021,state_code_2021,state_name_2021",
  });
  return groupBy(sa4, (item) => item.state_code_2021);
}

/** Fetch SA3 grouped by SA4 */
async function fetchSA3() {
  const sa3 = await fetchLayer("SA3", {
    outFields: "sa3_code_2021,sa3_name_2021,sa4_code_2021,sa4_name_2021",
  });
  return groupBy(sa3, (item) => item.sa4_code_2021);
}

/** Fetch SA2s grouped by SA3 (handles batching) */
async function fetchSA2() {
  // it's okay to make it hard coded here because the size of it will not change
  const batchParams = ["&resultOffset=0", "&resultOffset=2000"];
  const batches = await Promise.all(
    batchParams.map((p) =>
      fetchLayer("SA2", {
        extraParams: p,
        outFields: "sa2_code_2021,sa2_name_2021,sa3_code_2021,sa3_name_2021",
      })
    )
  );

  return batches
    .flat()
    .reduce<Record<string, InstanceType<typeof Graphic>[]>>((acc, sa2) => {
      acc[sa2.sa3_code_2021] = [...(acc[sa2.sa3_code_2021] || []), sa2];
      return acc;
    }, {});
}

/** GET /api/regions */
export async function GET() {
  try {
    const [states, sa4, sa3, sa2] = await Promise.all([
      fetchStates(),
      fetchSA4(),
      fetchSA3(),
      fetchSA2(),
    ]);

    const totalSA2 = Object.values(sa2).reduce(
      (sum, arr) => sum + arr.length,
      0
    );

    const responseData = {
      stats: {
        states: states.length,
        sa4Groups: Object.keys(sa4).length,
        sa3Groups: Object.keys(sa3).length,
        totalSA2,
      },
      data: { states, sa4, sa3, sa2 },
    };

    return NextResponse.json(responseData);
  } catch (err) {
    return NextResponse.json(
      { error: err || "Failed to fetch regions" },
      { status: 500 }
    );
  }
}
