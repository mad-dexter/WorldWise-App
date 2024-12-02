import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";

import styles from "./CountryList.module.css";
import { useCityContext } from "../context/CityContext";

function CountriesList() {
  // Get the data from global context
  const { cities, isLoading } = useCityContext();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city in the Map." />
    );

  // const countries = [];
  const countries = cities.reduce((agg, city) => {
    if (agg.findIndex((city1) => city1.country === city.country) === -1) {
      agg.push(city);
    }
    return agg;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountriesList;
