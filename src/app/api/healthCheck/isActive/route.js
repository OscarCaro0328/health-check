import { NextResponse } from "next/server"; // App router
//import { nsns } from "./data";
import { getNsnsForPage } from "./data.js";

const domain_dd = "https://us.dunkindonuts.switchboardcms.com";
const domain_mcd_uat = "https://us-mcd.uat.switchboardcms.com/";
const domain_arbys = "https://us-arbys.switchboardcms.com";
//const nsns = ["353155", "306321", "301677","1111101"];

export async function GET(request) {
  try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        let nsns = getNsnsForPage(page);
        console.log(nsns)
    // Check URL availability for all NSNs in parallel
    const results = await Promise.allSettled(
      nsns.map(async (nsn) => {
        const imageUrl = `${domain_arbys}/device/${nsn}/screenshot`;

        try {
          const response = await fetch(imageUrl, { method: "HEAD" });
          //console.log(response);
          return {
            nsn,
            status: response.ok
              ? "available" //200-299
              : `unavailable (status ${response.status})`,
          };
        } catch (error) {
          return { nsn, status: "error", message: "Failed to connect" };
        }
      })
    );
    //console.log(results);
    // Format the final response
    const formattedResults = results.map((result) => result.value);

    const nsn_available = formattedResults
      .filter((item) => item.status === "available")
      .map((item) => item.nsn);
    console.log(nsn_available);

    return NextResponse.json({ urls: formattedResults });
  } catch (error) {
    console.error("Error checking URLs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
