import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "55qwerty55",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = { user: null, isAutheticated: false };

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAutheticated: true, user: action.payload };
    case "logout":
      return { ...state, user: null, isAutheticated: false };
    default:
      throw new Error("Invalid option");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAutheticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isAutheticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth Context was used outside Auth provider");

  return context;
}

export { useAuth, AuthProvider };
