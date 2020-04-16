import moment from "moment";
import { getNumber } from ".";

export const getFormattedCountryHistory = (countryStats, country) => {
  const countryDateMap = countryStats.reduce((acc, current) => {
    acc[moment(current.record_date).format("MM DD YYYY")] = current;
    return acc;
  }, {});

  return Object.values(countryDateMap).reduce((acc, current) => {
    const { Confirmed = [], Deaths = [], Active = [], Recovered = [] } = acc;
    Confirmed.push({
      date: moment(current.record_date),
      value: getNumber(current.total_cases)
    });
    Deaths.push({
      date: moment(current.record_date),
      value: getNumber(current.total_deaths)
    });
    Active.push({
      date: moment(current.record_date),
      value: getNumber(current.active_cases)
    });
    Recovered.push({
      date: moment(current.record_date),
      value: getNumber(current.total_recovered)
    });
    return {
      label: country,
      Confirmed,
      Deaths,
      Active,
      Recovered
    };
  }, {});
};

const getCumulativeInfo = item =>
  (item || []).reduce((acc, current) => {
    acc.push({
      date: moment(current.date),
      value:
        (acc.length ? acc[acc.length - 1]?.value : 0) + getNumber(current.value)
    });
    return acc;
  }, []);

export const getFormattedStateHistory = (stateStats, state) => {
  const Active = getCumulativeInfo(stateStats.Active);
  const Confirmed = getCumulativeInfo(stateStats.Confirmed);
  const Deceased = getCumulativeInfo(stateStats.Deceased);
  const Recovered = getCumulativeInfo(stateStats.Recovered);
  return {
    label: stateStats.longKey,
    Active,
    Confirmed,
    Deceased,
    Recovered
  };
};
