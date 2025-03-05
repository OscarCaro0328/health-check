import { NextResponse } from "next/server"; // App router

const domain = "https://us.dunkindonuts.switchboardcms.com";
const nsns = ["353155", "306321", "301677","1111101"]; 

export async function GET() {
  try {
    // 
    const results = await Promise.allSettled(
      nsns.map(async (nsn) => {
        const imageUrl = `${domain}/device/${nsn}/screenshot`;  // url for primes

        try {
          const response = await fetch(imageUrl);

          if (!response.ok) {
            return { nsn, error: `Image not found (status ${response.status})` };
          }

          const arrayBuffer = await response.arrayBuffer();
          return { nsn, data: Buffer.from(arrayBuffer).toString("base64") }; // Convert image to base64
        } catch (error) {
          return { nsn, error: "Failed to fetch image" };
        }
      })
    );

    // Format the final response
    const formattedResults = results.map((result) => result.value);
    return NextResponse.json({ images: formattedResults });

  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
