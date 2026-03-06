"use server";

import { revalidatePath } from "next/cache";
import {
  addSegment,
  removeSegment,
  addCityMapping,
  removeCityMapping,
} from "@/lib/kv-city-mapper";

export async function addSegmentAction(formData: FormData) {
  const key = (formData.get("key") as string)?.trim().toUpperCase();
  const label = (formData.get("label") as string)?.trim();

  if (!key || !label) return;

  await addSegment(key, label);
  revalidatePath("/admin");
}

export async function removeSegmentAction(formData: FormData) {
  const key = formData.get("key") as string;
  if (!key) return;

  await removeSegment(key);
  revalidatePath("/admin");
}

export async function addCityAction(formData: FormData) {
  const city = (formData.get("city") as string)?.trim().toLowerCase();
  const segmentKey = formData.get("segmentKey") as string;

  if (!city || !segmentKey) return;

  await addCityMapping(city, segmentKey);
  revalidatePath("/admin");
}

export async function removeCityAction(formData: FormData) {
  const city = formData.get("city") as string;
  if (!city) return;

  await removeCityMapping(city);
  revalidatePath("/admin");
}
