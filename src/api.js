import axios from "axios";

let config = {
  headers: {
    "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
    "x-rapidapi-key": "25f8c07396msh086f42e1f71af3ap100a7bjsn6de6f7c3ba14"
  }
};

export const getWorldStats = async () =>
  await axios.get(
    "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
    config
  );
export const getWorldStatsNew = async () =>
  await axios.get("https://corona.lmao.ninja/v2/all?yesterday=false");
export const getCasesByCountryData = async () =>
  await axios.get(
    "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
    config
  );
export const getCasesByCountryDataNew = async () =>
  await axios.get(
    "https://corona.lmao.ninja/v2/countries?yesterday=false&sort=active"
  );
export const getCountryHistory = async country =>
  await axios.get(
    "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php",
    {
      ...config,
      params: {
        country
      }
    }
  );
export const getCountryHistoryNew = async country =>
  await axios.get(
    `https://corona.lmao.ninja/v2/historical/${country}?lastdays=30`
  );

export const getIndiaData = async () =>
  await axios.get("https://api.covid19india.org/data.json");

export const getIndiaDistrictData = async () =>
  await axios.get("https://api.covid19india.org/state_district_wise.json");

export const getIndiaDaily = async () =>
  await axios.get("https://api.covid19india.org/data.json");

export const getIndiaStateDaily = async () =>
  await axios.get("https://api.covid19india.org/states_daily.json");
