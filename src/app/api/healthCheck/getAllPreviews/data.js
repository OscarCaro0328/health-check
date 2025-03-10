export function getNsnsForPage(page) {
    const pageSize = 6;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
  
    if (page < 1 || page > 10) {
      return []; // Return an empty array for invalid page numbers
    }
  
    return nsns.slice(startIndex, endIndex);
  }



export const nsns = [

 "331967",
 "331018",
 "335037",
 "332047",
 "339598",
 "342324",
 "302509",
 "307823",
 "354847",
 "351112",
 "331018",
 "344824",
 "357106",
 "306321",
 "301677",
 "348405",
 "330690",
 "335037",
 "331967",
 "331018",
 "359059",
 "332047",
 "339598",
 "342324",
 "302509",
 "307823",
 "363413",
 "351112",
 "331018",
 "344824",
 "332047",
 "339598",
 "342324",
 "302509",
 "307823",
 "349323",
 "351112",
 "331018",
 "344824",
 "339598",
 "342324",
 "348454",
 "307823",
 "358215",
 "351112",
 "331018",
 "351112",
 "331018",
 "351112",
 "331018",
 "339598",
 "342324",
 "351112",
 "331018",
 "344824",
 "339598",
 "330706",
 "360623",
 "336784",
 "362469",
 "300392",
 "308387",

  ];