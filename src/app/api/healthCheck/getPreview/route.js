import { NextResponse } from "next/server"; // App router
//import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nsn = searchParams.get('nsn');

    if (!nsn || isNaN(nsn)) {
      return NextResponse.json({ error: 'Invalid nsn provided, must be a number' }, { status: 400 });
    }

    const imageUrl = `https://us.dunkindonuts.switchboardcms.com/device/${nsn}-107/screenshot`;
    //console.log(imageUrl);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: `Image not found (status ${response.status})` }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    const headers = {
      'Content-Type': response.headers.get('content-type'),
    };
    //console.log(headers);
    return new NextResponse(arrayBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
