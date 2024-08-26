"use client"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import useSearchTerm from "@/hooks/useSearchTerm"
import { ChangeEventHandler } from "react"

const SearchBar = () => {
  const {title,setTitle} = useSearchTerm()
  const handleChange:ChangeEventHandler<HTMLInputElement> = (e)=>{
    setTitle(e.target.value)
  }
  return (
    <div className="relative sm:block hidden">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground"/>
      <Input value={title} onChange={handleChange} className="pl-8 bg-primary/10 h-10" placeholder="Search..."/>
    </div>
  )
}

export default SearchBar
