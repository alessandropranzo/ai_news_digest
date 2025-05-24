import type { Digest } from "@/types/digest";

const API_BASE_URL: string = import.meta.env.VITE_BACKEND_URL ?? ""; // e.g. "http://localhost:8000"

/**
 * Fetch all digests (newest first) from the backend.
 *
 * @param limit Optional maximum number of digests to request.
 */
export async function fetchDigests(limit?: number): Promise<Digest[]> {
  let endpoint = `${
    API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : ""
  }/api/digests`;
  if (limit) {
    endpoint += `?limit=${limit}`;
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to fetch digests: ${response.status} ${message}`);
  }

  const data: Digest[] = await response.json();
  return data;
}

/**
 * Create a new digest.
 *
 * @param digestData The data for the new digest.
 */
export async function createDigest(
  digestData: Omit<Digest, "id_digests" | "created_at" | "digest_number">
): Promise<Digest> {
  const endpoint = `${
    API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : ""
  }/api/digests/create`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(digestData),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to create digest: ${response.status} ${message}`);
  }

  const createdDigest: Digest = await response.json();
  return createdDigest;
}
