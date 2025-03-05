import { NextResponse } from "next/server";
import sharp from 'sharp';

const domain = "https://us.dunkindonuts.switchboardcms.com";
const nsns = ["357106", "306321", "301677", "348405"];

export async function GET() {
  try {
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

    const commonWidth = 600; // Choose a common width
    const commonHeight = 200; // Choose a common height

    const resizedImages = await Promise.all(images.map(async (image) => {
      return sharp(image)
        .resize(commonWidth, commonHeight)
        .toBuffer();
    }));

    const compositeImage = await sharp({ create: { width: commonWidth * 2, height: commonHeight * 2, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
      .composite([
        { input: resizedImages[0], top: 0, left: 0 },
        { input: resizedImages[1], top: 0, left: commonWidth },
        { input: resizedImages[2], top: commonHeight, left: 0 },
        { input: resizedImages[3], top: commonHeight, left: commonWidth },
      ])
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