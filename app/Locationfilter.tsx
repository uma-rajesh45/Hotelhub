"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useLocation from "@/hooks/useLocation"
import { ICity, IState } from "country-state-city"
import useSearchTerm from "@/hooks/useSearchTerm";
import { useEffect, useState } from "react";

export function LocationFilter() {
    const [states,setstates] = useState<IState[]>();
    const [cities,setCities] = useState<ICity[]>()
    const {country,setCountry,state,setState,setCity} = useSearchTerm();
    const {getAllCountries,getCountryStates,getStateCities}= useLocation()

    const countries = getAllCountries;
    useEffect(()=>{
        const countryStates = getCountryStates(country as string)
        if(countryStates){
            setstates(countryStates)
        }
    },[country])
    useEffect(()=>{
        const stateCities = getStateCities(country as string,state as string)
        if(stateCities){
            setCities(stateCities)
        }
    },[country,state])
  return (
    <div className="flex gap-2 md:gap-5 justify-center mt-5">
        <Select onValueChange={(value:string)=>setCountry(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select A Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Country...</SelectLabel>
          {countries.map((country)=><SelectItem value={country.isoCode} key={country.isoCode}>{country.name}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select onValueChange={(value)=>setState(value)} disabled={states?.length!<1}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select A State" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select State...</SelectLabel>
          {states?.map((state)=><SelectItem value={state.isoCode} key={state.isoCode}>{state.name}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select onValueChange={(value)=>setCity(value)} disabled={cities?.length!<1}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select A City" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select State...</SelectLabel>
          {cities?.map((city)=><SelectItem value={city.name} key={city.latitude}>{city.name}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
    
  )
}
