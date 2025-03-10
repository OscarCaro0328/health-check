//usage http://localhost:3000/api/healthCheck/getAllPreviews?page=1   Pages between 1 and 10


import { NextResponse } from "next/server";
import sharp from 'sharp';
import { getNsnsForPage } from "./data.js";


const domain = "https://us.dunkindonuts.switchboardcms.com";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    let nsns = getNsnsForPage(page);
    console.log(nsns)


    const results = await Promise.allSettled(
      nsns.map(async (nsn) => {
        const imageUrl = `${domain}/device/${nsn}/screenshot`;

        try {
          const response = await fetch(imageUrl);

          if (!response.ok) {
            return { nsn, error: `Image not found (status ${response.status})` };
          }

          const arrayBuffer = await response.arrayBuffer();
          return { nsn, data: Buffer.from(arrayBuffer) };
        } catch (error) {
          return { nsn, error: "Failed to fetch image" };
        }
      })
    );

    const images = results
      .filter((result) => result.status === "fulfilled" && result.value.data)
      .map((result) => result.value.data);

    if (images.length !== nsns.length) {
      return NextResponse.json({ error: "Could not retrieve all images." }, { status: 500 });
    }

    const commonWidth = 320;  // Original 3840
    const commonHeight = 90; //  Original 1080

    const resizedImages = await Promise.all(images.map(async (image) => {
      return sharp(image)
        .resize(commonWidth, commonHeight)
        .toBuffer();
    }));

    const originalCompositeWidth = commonWidth * 3;
    const originalCompositeHeight = commonHeight * 2;

   // const reducedCompositeWidth = Math.round(originalCompositeWidth * 1.0); 
   // const reducedCompositeHeight = Math.round(originalCompositeHeight * 1.0); 

    const compositeImage = await sharp({ create: { width: originalCompositeWidth, height: originalCompositeHeight, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
      .composite([
        { input: resizedImages[0], top: 0, left: 0 },
        { input: resizedImages[1], top: 0, left: commonWidth },
        { input: resizedImages[2], top: 0, left: commonWidth * 2 },
        { input: resizedImages[3], top: commonHeight, left: 0 },
        { input: resizedImages[4], top: commonHeight, left: commonWidth },
        { input: resizedImages[5], top: commonHeight, left: commonWidth * 2 },
        //{ input: resizedImages[6], top: commonHeight * 2, left: 0 },
       // { input: resizedImages[7], top: commonHeight * 2, left: commonWidth },
        //{ input: resizedImages[8], top: commonHeight * 2, left: commonWidth * 2 },
      ])
      //.resize(reducedCompositeWidth, reducedCompositeHeight) // Resize the composite image
      .png()
      .toBuffer();

    return new NextResponse(compositeImage, {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}