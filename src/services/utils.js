import { jwtDecode } from "jwt-decode";


export const sortListings = (listings, field, order) => {
  if(order == "asc") {
    listings.sort((a, b) => ((a[field] > b[field]) ? 1 : -1));
  } else {
    listings.sort((a, b) => ((a[field] > b[field]) ? -1 : 1));
  }

  listings.sort((a,b) => {
    if(order == "asc") {
        if (a[field] < b[field]) {
            return -1;
        }

        if (a[field] > b[field]) {
            return 1;
        }

        return 0;
    } else {
        if (a[field] < b[field]) {
            return 1;
        }

        if (a[field] > b[field]) {
            return -1;
        }
        return 0;

        // return a[field] - b[field];
    }
});
  return listings;
} 

export const validateJwtToken = (token) => {
    if(!token) {
      return false;
    }
    try {
      const decodedJwt = jwtDecode(token);
      console.log(decodedJwt);
      return decodedJwt.exp >= Date.now() / 1000;
    } catch {
      return false;
    }
}

export const formatUrl = (url) => {
  return url.includes("http") ? url : `https://www.${url}`;
}

export const formatPhoneNumber = (phone) => {
  let numbers = `${phone}`.match(/\d/g);    
  return numbers ? `+${numbers.join("")}` : "";
}