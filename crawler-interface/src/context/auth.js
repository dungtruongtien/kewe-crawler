import React, { useState, createContext } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <AuthContext.Provider
      value={[userInfo, setUserInfo]}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;