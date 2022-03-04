let accessToken = "";

export const setAccessToken = (s: string) => {
  return accessToken = s;
}

export const getAccessToken = () => {
  // console.log("from acces token " ,accessToken)
  return accessToken; 
}

