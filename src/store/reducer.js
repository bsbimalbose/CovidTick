import produce from "immer";
import { getNumber } from "../utils";
import moment from "moment";
import { countries, indiaStateCodes } from "../constants";

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

export default (state = {}, action) => {
  console.log("action", action);
  switch (action.type) {
    case "LOAD_CASES_BY_COUNTRY": {
      return produce(state, draft => {
        if (!draft?.dashboard) {
          draft.dashboard = {};
        }
        draft.dashboard.isCountryStatsLoading = true;
      });
    }
    case "LOAD_WORLD_STATS": {
      return produce(state, draft => {
        if (!draft?.dashboard) {
          draft.dashboard = {};
        }
        draft.dashboard.isWorldStatsLoading = true;
      });
    }
    case "SET_WORLD_STATS": {
      return produce(state, draft => {
        const worldStat = action.value || {};
        if (!draft?.dashboard) {
          draft.dashboard = {};
        }
        draft.dashboard.worldStat = {
          new_cases: getNumber(worldStat?.todayCases),
          cases: getNumber(worldStat?.cases),
          active_cases: getNumber(worldStat?.active),
          total_recovered: getNumber(worldStat?.recovered),
          new_deaths: getNumber(worldStat?.todayDeaths),
          deaths: getNumber(worldStat?.deaths)
        };
        draft.dashboard.isWorldStatsLoading = false;
      });
    }
    case "SET_INDIA_TEST_STATS": {
      return produce(state, draft => {
        const indiaTestData = action.value?.states_tested_data || [];
        const testStats = indiaTestData.reduce((acc, current) => {
          const currentUpdatedDate = moment(current.updatedon, "DD/MM/YYYY");
          const isValuePresent =
            current.totaltested && current.totaltested.trim() !== "";
          const oldUpdatedData = acc?.[current.state]?.updatedon
            ? moment(acc?.[current.state]?.updatedon, "DD/MM/YYYY")
            : false;
          if (
            isValuePresent &&
            !(
              oldUpdatedData &&
              currentUpdatedDate.isSameOrBefore(oldUpdatedData)
            )
          ) {
            acc[current.state] = { ...current, updatedon: currentUpdatedDate };
          }
          return acc;
        }, {});
        if (!draft?.india) {
          draft.india = {};
        }
        draft.india.testStats = testStats;
      });
    }
    case "SET_CASES_BY_COUNTRY": {
      return produce(state, draft => {
        if (!draft?.dashboard) {
          draft.dashboard = {};
        }
        draft.dashboard.isCountryStatsLoading = false;
        draft.dashboard.casesByCountry = (action.value || [])
          .filter(country => !nonCountries.includes(country.country_name))
          .map(country => ({
            ...country,
            cases: getNumber(country?.cases),
            new_cases: getNumber(country?.todayCases),
            active_cases: getNumber(country?.active),
            deaths: getNumber(country?.deaths),
            new_deaths: getNumber(country?.todayDeaths),
            total_recovered: getNumber(country?.recovered)
          }));
        draft.dashboard.updated = action.value?.statistic_taken_at || "";
      });
    }

    case "COUNTRY_SEARCH": {
      const newLocations = (state?.dashboard?.casesByCountry || []).map(
        countryInfo => ({
          ...countryInfo,
          hidden: !(countryInfo?.country || "")
            .toLowerCase()
            .includes(action.value.trim().toLowerCase())
        })
      );
      return produce(state, draftState => {
        if (!draftState?.dashboard) {
          draftState.dashboard = {};
        }
        draftState.dashboard.casesByCountry = newLocations;
      });
    }

    case "LOAD_SATE_DATA": {
      return produce(state, draft => {
        if (!draft?.india) {
          draft.india = {};
        }
        draft.india.isStateLoading = true;
      });
    }
    case "LOAD_DISTRICT_DATA": {
      return produce(state, draft => {
        if (!draft?.india) {
          draft.india = {};
        }
        draft.india.isDistrictLoading = true;
      });
    }

    case "SET_INDIA_CASES_BY_STATE": {
      const india = produce(state.india || {}, draft => {
        draft.isStateLoading = false;
        const newStateData = action?.value?.statewise || [];

        const daily = action?.value?.cases_time_series || {};
        draft.daily = daily.map(item => ({
          ...item,
          date: moment(item.date + "2020", "DD MMMM YYYY")
        }));

        const rawSummary = newStateData.find(state => state.state === "Total");
        draft.indiaStats = {
          confirmed: getNumber(rawSummary.confirmed),
          deltaconfirmed: getNumber(rawSummary.deltaconfirmed),
          active: getNumber(rawSummary.active),
          deaths: getNumber(rawSummary.deaths),
          deltadeaths: getNumber(rawSummary.deltadeaths),
          recovered: getNumber(rawSummary.recovered),
          deltarecovered: getNumber(rawSummary.deltarecovered)
        };
        draft.casesByState = (newStateData || [])
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
      return { ...state, india: india || {} };
    }
    case "SET_INDIA_DISTRICT_DATA": {
      const india = produce(state.india || {}, draft => {
        draft.districtInfo = action.value || {};
        draft.isDistrictLoading = false;
      });
      return { ...state, india };
    }
    case "SET_INDIA_DAILY_DATA": {
      const india = produce(state.india || {}, draftState => {
        const daily = action?.value?.cases_time_series || {};
        draftState.daily = daily.map(item => ({
          ...item,
          date: moment(item.date + "2020", "DD MMMM YYYY")
        }));
      });
      return { ...state, india };
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
        india: { ...state.india, locationWithDistrict }
      };
    }
    case "SET_INDIA_HISTORY_STATES": {
      return produce(state, draft => {
        const stateDailyDraft = (action.value || []).reduce((acc, item) => {
          const stateKeys = Object.keys(item).filter(
            key => key !== "date" || key !== "status"
          );

          stateKeys.map(key => {
            let existing = acc.find(accItem => accItem.key === key);
            if (!existing) {
              existing = { key, longKey: indiaStateCodes[key.toUpperCase()] };
              acc.push(existing);
            }
            if (!existing[item.status]) {
              existing[item.status] = [];
            }
            existing[item.status].push({ date: item.date, value: item[key] });
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
    case "COMPARE_LOAD": {
      return produce(state, draft => {
        if (!draft?.compare) {
          draft.compare = {};
        }
        draft.compare.isLoading = true;
      });
    }
    case "ADD_COMPARISON_HISTORY": {
      return produce(state, draft => {
        draft.compare = {
          ...draft.compare,
          comparisonHistory: [
            ...(draft?.compare?.comparisonHistory || []),
            action.value
          ],
          isLoading: false
        };
      });
    }
    case "REMOVE_COMPARISON_HISTORY": {
      return produce(state, draft => {
        draft.compare.comparisonHistory = (
          draft.compare.comparisonHistory || []
        ).filter(item => item.label !== action.value.label);
        draft.compare.current = (draft.compare.current || []).filter(
          item => item.label !== action.value.label
        );
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
            : "State"
        });
      });
    }

    default:
      return state;
  }
};
