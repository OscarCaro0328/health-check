HealthCheck tool

Run the API Locally
-npm install
-npm run dev. 
-localhost:3000

1. Get Preview ((Currently available for us.dunkindonuts.switchboardcms.com))
Endpoint: /api/healthCheck/getPreview
Method: GET
Query Parameters:
nsn (required) - Example: 123456 
mp (optional) - Example: 107
Usage: http://localhost:3000/api/healthCheck/getPreview?nsn=347393&mp=107
Description:
Retrieves a preview screenshot for the given nsn from the Dunkin domain.


2. Get All Previews
Endpoint: /api/healthCheck/getAllPreviews
Method: GET
Query Parameters:
page (required) - Must be between 1 and 10
Usage: http://localhost:3000/api/healthCheck/getAllPreviews?page=1
Description:
Uses a static set of Dunkin NSNs.
The endpoint fetches 6 NSNs based on the requested page.
It collects screenshots from the primary media player for each NSN.
Images are resized by a factor of 12 to reduce loading times.
A new image is generated that combines all 6 screenshots in a 2 row 3 column grid


3. Check Active Status
Endpoint: /api/healthCheck/isActive
Method: GET
Query Parameters:
page (required) - Must be between 1 and 10
Usage: http://localhost:3000/api/healthCheck/isActive?page=1  
Description:
Uses a static set of Arbys NSNs.
The endpoint fetches 10 NSNs based on the requested page.
It sends a head requets to the https://us-arbys.switchboardcms.com/device/${nsn}$/screenshot/
to check to see if media player is online (status 200-299), if the media player is offline (status 504) 
of if the media player does not exists (status 500)


