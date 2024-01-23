import { z } from "zod";

export const zBoolean = z.coerce.boolean();
export const zStringRequired = z.string().min(1, "This field is required !").max(255).trim();
export const zEmail = zStringRequired.email().trim();
export const zArray = z.array(z.string()).min(1, "This field is required !");
export const zChoice = z.string().min(1, { message: "Please, select your choice !" }).max(255).trim();
