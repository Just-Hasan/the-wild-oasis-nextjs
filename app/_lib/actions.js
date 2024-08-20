// only to define server actions
"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const nationalIDRegex = /^[a-zA-Z0-9]{6,12}$/;
  const { user } = await auth();
  if (!user) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");

  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!nationalIDRegex.test(nationalID)) {
    throw new Error("Please provide a valid national id");
  }

  const updateData = { nationality, countryFlag, nationalID };

  const { _, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const { user } = await auth();
  if (!user)
    throw new Error("You must be logged in first to delete a reservation");

  const newBooking = {
    ...bookingData,
    guestId: user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { _, error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const { user } = await auth();
  const userBookings = await getBookings(user.guestId);
  const userBookingsId = userBookings.map((booking) => booking.id);

  if (!userBookingsId.includes(bookingId))
    throw new Error("You are not authorized to delete this reservation");

  if (!user)
    throw new Error("You must be logged in first to delete a reservation");

  const { _, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations").slice(0, 1000);
  const bookingId = Number(formData.get("bookingId"));

  //crucial for authorization
  const { user } = await auth();
  const userBookings = await getBookings(user.guestId);
  const userBookingsId = userBookings.map((booking) => booking.id);

  if (!userBookingsId.includes(bookingId))
    throw new Error("You are not authorized to update this reservation");
  //

  // 3). Building Update Data
  const updatedFields = { numGuests, observations };

  // 4). Mutation
  const { _, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId);

  // 5). Error handling
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  // 6). Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 7). Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut("google", { redirectTo: "/" });
}
