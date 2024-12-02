import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CityContext = createContext();
const URL = "http://localhost:9000/cities";

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
        currentCity: {},
      };
    default:
      throw new Error("Not a proper type");
  }
}

function CityContextProvider({ children }) {
  const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
  };

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const getCityDetails = useCallback(async function getCityDetails(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/${id}`);
      const response = await res.json();

      dispatch({ type: "city/loaded", payload: response });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  async function postCityDetails(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();

      dispatch({ type: "city/loaded", payload: response });
      dispatch({ type: "cities/created", payload: response });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteCityDetails(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/${id}`, {
        method: "DELETE",
      });
      await res.json();

      dispatch({ type: "cities/deleted", payload: id });
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(function () {
    async function loadCityData() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(URL);
        const response = await res.json();

        dispatch({ type: "cities/loaded", payload: response });
      } catch (err) {
        console.log(err.message);
      }
    }
    loadCityData();
  }, []);

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        getCityDetails,
        currentCity,
        postCityDetails,
        deleteCityDetails,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCityContext() {
  const context = useContext(CityContext);
  if (context === undefined)
    return new Error("Context used outside City Context");

  return context;
}

export { CityContextProvider, useCityContext };
