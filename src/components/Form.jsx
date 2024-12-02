// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useURLPosition } from "../hooks/useURLPosition";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCityContext } from "../context/CityContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [mapLat, mapLong] = useURLPosition();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState("");
  const navigate = useNavigate();

  const { postCityDetails, isLoading } = useCityContext();

  useEffect(
    function () {
      async function getCityForLatLong() {
        try {
          setIsFormLoading(true);
          setGeoCodingError("");

          const resp = await fetch(
            `${BASE_URL}?latitude=${mapLat}&longitude=${mapLong}`
          );
          const response = await resp.json();
          console.log(response);
          if (!response.countryCode)
            throw new Error(
              "This is not a country. Please select somewhere else."
            );

          setCityName(response.city || response.locality || "");
          setCountry(response.countryName);
          setEmoji(convertToEmoji(response.countryCode));
        } catch (err) {
          setGeoCodingError(err.message);
        } finally {
          setIsFormLoading(false);
        }
      }
      getCityForLatLong();
    },
    [mapLat, mapLong]
  );

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const formEntry = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: mapLat, lng: mapLong },
    };
    await postCityDetails(formEntry);
    navigate("/app/cities");
  }

  if (!mapLat && !mapLong)
    return (
      <Message message="Please click on the map to starte entering data."></Message>
    );

  if (isFormLoading) return <Spinner />;

  if (geoCodingError) return <Message message={geoCodingError}></Message>;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleFormSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
