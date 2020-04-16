import produce from "immer";
import { getNumber } from "../utils";
import moment from "moment";
import { compareColors, countries } from "../constants/COMPARE";
import { indiaStateCodes } from "../constants/IN_STATE_CODES";

const nonCountries = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Oceania",
  "Africa",
  ""
];
const nonStates = ["Total"];

export default (state, action) => {
  console.log("action", action);
  switch (action.type) {
    case "SET_NEW_WORLD_DATA": {
      return {
        ...state,
        worldStats: (action.value?.countries_stat || [])
          .filter(country => !nonCountries.includes(country.country_name))
          .map(country => ({
            ...country,
            cases: getNumber(country?.cases),
            new_cases: getNumber(country?.new_cases),
            active_cases: getNumber(country?.active_cases),
            deaths: getNumber(country?.deaths),
            new_deaths: getNumber(country?.new_deaths),
            total_recovered: getNumber(country?.total_recovered)
          })),
        updated: action.value?.statistic_taken_at || ""
      };
    }
    case "COUNTRY_SEARCH": {
      const newLocations = (state?.worldStats || []).map(countryInfo => ({
        ...countryInfo,
        hidden: !(countryInfo?.country_name || "")
          .toLowerCase()
          .includes(action.value.trim().toLowerCase())
      }));
      return produce(state || {}, draftState => {
        draftState.worldStats = newLocations;
      });
    }

    case "SET_INDIA_DATA": {
      const indiaStats = produce(state.indiaStats || {}, draftState => {
        const newStateData = action?.value?.statewise || [];
        const rawSummary = newStateData.find(state => state.state === "Total");
        draftState.summary = {
          confirmed: getNumber(rawSummary.confirmed),
          deltaconfirmed: getNumber(rawSummary.deltaconfirmed),
          active: getNumber(rawSummary.active),
          deaths: getNumber(rawSummary.deaths),
          deltadeaths: getNumber(rawSummary.deltadeaths),
          recovered: getNumber(rawSummary.recovered),
          deltarecovered: getNumber(rawSummary.deltarecovered)
        };
        draftState.statewise = (newStateData || [])
          .filter(
            state =>
              !nonStates.includes(state?.state) &&
              getNumber(state?.confirmed) !== 0
          )
          .map(state => ({
            ...state,
            confirmed: getNumber(state?.confirmed),
            deltaconfirmed: getNumber(state?.deltaconfirmed),
            active: getNumber(state?.active),
            deaths: getNumber(state?.deaths),
            deltadeaths: getNumber(state?.deltadeaths),
            recovered: getNumber(state?.recovered),
            deltarecovered: getNumber(state?.deltarecovered)
          }));
      });
      return { ...state, indiaStats: indiaStats || {} };
    }
    case "SET_INDIA_DISTRICT_DATA": {
      const indiaStats = produce(state.indiaStats || {}, draftState => {
        draftState.districtInfo = action.value || {};
      });
      return { ...state, indiaStats };
    }
    case "SET_INDIA_DAILY_DATA": {
      const indiaStats = produce(state.indiaStats || {}, draftState => {
        const daily = action?.value?.cases_time_series || {};
        draftState.daily = daily.map(item => ({
          ...item,
          date: moment(item.date + "2020", "DD MMMM YYYY")
        }));
      });
      return { ...state, indiaStats };
    }
    case "COMBINE_STATE_DISTRICT": {
      const locationWithDistrict = (action.state || []).map(state => {
        const rawDistrict =
          action.districtInfo?.[state.state]?.districtData || [];
        const districtDetails = Object.keys(rawDistrict).map(key => ({
          name: key,
          confirmed: rawDistrict[key]?.confirmed,
          new_confirmed: rawDistrict[key]?.delta?.confirmed
        }));
        return {
          ...state,
          districtDetails: districtDetails
        };
      });

      return {
        ...state,
        indiaStats: { ...state.indiaStats, locationWithDistrict }
      };
    }
    case "SET_INDIA_HISTORY_STATES": {
      // debugger;
      return produce(state, draft => {
        const stateDailyDraft = (action.value || []).reduce((acc, item) => {
          const stateKeys = Object.keys(item).filter(
            key => key !== "date" || key !== "status"
          );

          stateKeys.map(key => {
            let existing = acc.find(accItem => accItem.key === key);
            // debugger;
            if (!existing) {
              existing = { key, longKey: indiaStateCodes[key.toUpperCase()] };
              acc.push(existing);
            }
            if (!existing[item.status]) {
              existing[item.status] = [];
            }
            existing[item.status].push({ date: item.date, value: item[key] });
            // debugger;
          });

          return acc;
        }, []);
        const stateDaily = stateDailyDraft.map((state, stateIndex) => {
          const newStateInfo = state;
          newStateInfo.Active = [];
          newStateInfo.Confirmed.forEach((item, confIndex) => {
            const death = getNumber(newStateInfo?.Deceased?.[confIndex]?.value);
            const recovered = getNumber(
              newStateInfo?.Recovered?.[confIndex]?.value
            );
            newStateInfo.Active.push({
              date: item.date,
              value: getNumber(item.value) - death - recovered
            });
          });
          return newStateInfo;
        });

        draft.compare = {
          stateDaily,
          current: []
        };
      });
    }
    case "SET_WORLD_HISTORY_COUNTRIES": {
      return produce(state, draft => {
        draft.compare = {
          ...draft.compare,
          countryDaily: action.value || []
        };
      });
    }
    case "ADD_COMPARISON_HISTORY": {
      return produce(state, draft => {
        draft.compare = {
          ...draft.compare,
          comparisonHistory: [
            ...(draft?.compare?.comparisonHistory || []),
            action.value
          ]
        };
      });
    }
    case "ADD_COMPARE_ITEM": {
      return produce(state, draft => {
        if (!draft.compare?.current) {
          draft.compare.current = [];
        }
        draft.compare.current.push({
          label: action.value,
          type: countries.find(country => country === action.value)
            ? "Country"
            : "State",
          color: compareColors[draft.compare.length]
        });
      });
    }

    default:
      return state;
  }
};
