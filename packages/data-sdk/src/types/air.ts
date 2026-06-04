/**
 * Aviation reference data served by the Voyant Data air API (`/data/air/v1`):
 * airports, airlines, and aircraft types. Built from open data (OurAirports,
 * OpenFlights, a curated aircraft list).
 */

export type AirportType =
  | "large_airport"
  | "medium_airport"
  | "small_airport"
  | "heliport"
  | "seaplane_base"
  | "balloonport"
  | "closed";

export interface Airport {
  iataCode: string;
  icaoCode?: string;
  name: string;
  type: AirportType;
  city?: string;
  countryIso2: string;
  regionCode?: string;
  latitude: number;
  longitude: number;
  elevationFt?: number;
  timezone?: string;
  scheduledService: boolean;
  wikipediaUrl?: string;
  lastUpdated: string;
}

export interface Airline {
  iataCode: string;
  icaoCode?: string;
  name: string;
  alias?: string;
  callsign?: string;
  countryIso2?: string;
  countryName?: string;
  active: boolean;
  logoUrl?: string;
  lastUpdated: string;
}

export type AircraftCategory =
  | "narrow_body"
  | "wide_body"
  | "regional_jet"
  | "turboprop"
  | "private_jet"
  | "helicopter"
  | "other";

export interface Aircraft {
  iataCode: string;
  icaoCode?: string;
  name: string;
  manufacturer: string;
  category: AircraftCategory;
  typicalSeats?: number;
  rangeKm?: number;
  lastUpdated: string;
}
