export const getAccessToken = () => {
  // Cerchiamo di ottenere l'access_token dal cookie
  const accessToken = getCookie('access_token');
  if (!accessToken) {
    console.error("Access Token non trovato nei cookie");
  }
  return accessToken;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};
