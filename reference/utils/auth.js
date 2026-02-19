export const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };
  
  export const getUserRole = () => {
    const user = getUser();
    return user?.role?.toUpperCase() || "UNAUTHORIZED";
  };
  
  export const isAuthenticated = () => Boolean(getUser());
  