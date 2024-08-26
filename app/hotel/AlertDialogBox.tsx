"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast";
import { Hotel, Room } from "@prisma/client";
import axios from "axios"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
type FormProps = {
    hotel?:
      | (Hotel & {
          rooms: Room[];
        })
    }
const AlertDialogBox = ({hotel}:FormProps) => {
    const [deleting,setIsDeleting] = useState(false);
    const router = useRouter();
    const deleteHotel =async ()=>{
      setIsDeleting(true)
      try {
        const getImageKey = (imageUrl:string)=>imageUrl.substring(imageUrl.lastIndexOf("/")+1)
        const imageKey = getImageKey(hotel?.image!)
        try {
          setIsDeleting(false);
          await axios.delete(`/api/hotel/${hotel?.id}`)
          await axios.post("/api/uploadthing/delete",{imageKey})
          router.push("/") 
            toast({
              variant:"default",
              description:"Your Hotel Is Successfully Deleted :)"
            })
        
        } catch (error) {
          toast({
            variant:"destructive",
            description:"Please delete all the rooms and try to delete the hotel (or) may be there is an Internal server error"
          })
        setIsDeleting(false)
        }
        setIsDeleting(false)
      } catch (error) {
        toast({
          description:"something is wrong with the server!"
          })
          setIsDeleting(false)
      }  
    }
  return (
    <AlertDialog>
  <AlertDialogTrigger 
  disabled={deleting}
  className="m-auto mb-10  p-3 w-3/6 font-bold mt-10 flex justify-center bg-destructive rounded-lg"
  >Delete Hotel{deleting&&<Loader2/>}</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your hotel
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={deleteHotel} className="bg-destructive text-white">Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default AlertDialogBox
  