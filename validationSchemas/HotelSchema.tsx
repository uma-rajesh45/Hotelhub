import { z } from "zod";

export type FieldName = 
  | 'title' 
  | 'description' 
  | 'image' 
  | 'country' 
  | 'state' 
  | 'city' 
  | 'locationdescription' ;
export type hotelAmenities = 
  |'gym'
  |'spa'
  |'bar'
  |'laundry'
  |'restaurant'
  |'shopping'
  |'freeparking'
  |'bikerental'
  |'freewifi'
  |'movienights'
  |'swimmingpool'
  |'coffeshop';
export const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(10, {
      message: "Description is required and atleast should be 10 characters",
    }),
    image: z.string().min(1, { message: "Image is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().optional(),
    city: z.string().optional(),
    locationdescription: z.string().min(10, {
      message:
        "LocationDescription is required and atleast should be 10 characters",
    }),
    gym: z.boolean().optional(),
    spa: z.boolean().optional(),
    bar: z.boolean().optional(),
    laundry: z.boolean().optional(),
    restaurant: z.boolean().optional(),
    shopping: z.boolean().optional(),
    freeparking: z.boolean().optional(),
    bikerental: z.boolean().optional(),
    freewifi: z.boolean().optional(),
    movienights: z.boolean().optional(),
    swimmingpool: z.boolean().optional(),
    coffeshop: z.boolean().optional(),
  });