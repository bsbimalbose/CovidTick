import produce from "immer";
import moment from "moment";

export const get = (value = {}, path, defaultValue) =>
  value
    ? (() =>
        typeof path === "string"
          ? path.replace(/\[(\d+)]/g, ".$1")
          : path.join("."))()
        .split(".")
        .filter(Boolean)
        .every(
          step =>
            (value =
              value[step] !== null || undefined ? value[step] : undefined) !==
            undefined
        )
      ? value
      : defaultValue
    : defaultValue;

export const getDeviceLabel = () =>
  window.innerWidth <= 375
    ? "sLabel"
    : window.innerWidth <= 769
    ? "mLabel"
    : "label";


export const combineProvincesToFormCountryInfo = locationsData => {
  const countryMap = locationsData.reduce((acc, location) => {
    if (!acc[location.country_code]) {
      acc[location.country_code] = location;
    } else {
      const countryInfo = produce(acc[location.country_code], draft => {
        draft.latest = {
          confirmed:
            (draft?.latest?.confirmed || 0) +
            (location?.latest?.confirmed || 0),
          deaths:
            (draft?.latest?.deaths || 0) + (location?.latest?.deaths || 0),
          recovered:
            (draft?.latest?.recovered || 0) + (location?.latest?.recovered || 0)
        };
      });
      acc[location.country_code] = countryInfo;
    }
    return acc;
  }, {});

  return Object.values(countryMap);
};

export const getFromLocalStorage = key => {
  const item = localStorage.getItem(key);
  if (item) {
    const value = JSON.parse(item);
    const writtenStamp = value?.timestamp;
    const ageInMinutes = moment().diff(writtenStamp, "minutes");
    if (ageInMinutes > 30) {
      return false;
    }
    return value?.value;
  }
  return false;
};

export const saveToLocalStorage = (key, value) => {
  Promise.resolve().then(function() {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: moment(),
        value
      })
    );
  });
};

export const getNumber = item =>
  typeof item === "string"
    ? parseInt(item.replace(/,/g, ""))
    : typeof item === "number"
    ? item
    : 0;
