import {Country,State,City} from "country-state-city"
const useLocation = ()=>{
    const getCountryByCode = (countryCode:string)=>{
        return Country.getCountryByCode(countryCode);
    }
    const getStateByCode = (countryCode:string,stateCode:string)=>{
        const states = State.getStateByCodeAndCountry(countryCode,stateCode);
        if(!states) return null;
        // console.log(states.name)
        return states;
    }
    const getCountryStates = (countryCode:string)=>{
        return State.getStatesOfCountry(countryCode);
    }
    const getStateCities = (countryCode:string,stateCode:string)=>{
        return City.getCitiesOfState(countryCode,stateCode);
    }
    const getCityByCoutryCode = (countryCode:string)=>{
        return City.getCitiesOfCountry(countryCode);
    }
    return {
        getAllCountries:Country.getAllCountries(),
        getCountryByCode,
        getCountryStates,
        getStateCities,
        getStateByCode,
        getCityByCoutryCode
       
    }
}
export default useLocation;