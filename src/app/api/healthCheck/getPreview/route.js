import { NextResponse } from "next/server"; // App router
//usage http://localhost:3000/api/healthCheck/getPreview?nsn=347393&mp=107
// nsn and mp are arguments passed to the endPoint

  const domain = "https://us.dunkindonuts.switchboardcms.com";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nsn = searchParams.get('nsn');
    const mp  = searchParams.get('mp');

    if (!nsn || isNaN(nsn)) {
      return NextResponse.json({ error: 'Invalid nsn provided, must be a number' }, { status: 400 });
    }


    let imageUrl;
    console.log(`mp number: ${mp}`);

    //if No mp is passed, the API will display prime image
    if (mp === null) {
      
      imageUrl = `${domain}/device/${nsn}/screenshot`;
    } else {
      
      imageUrl = `${domain}/device/${nsn}-${mp}/screenshot`;
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: `Image not found (status ${response.status})` }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    const headers = {
      'Content-Type': response.headers.get('content-type'),
    };
    console.log(headers);
    return new NextResponse(arrayBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
