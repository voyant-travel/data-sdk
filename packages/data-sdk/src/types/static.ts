/** ISO 3166-1 alpha-2 country record (`/data/static/v1/countries`). */
export interface Country {
  iso2: string;
  iso3: string;
  numericCode: string;
  name: string;
  officialName: string;
  region: string;
  subregion?: string;
  capital?: string;
  callingCode?: string;
  currencies: string[];
  languages: string[];
  flagEmoji?: string;
  lastUpdated: string;
}

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

export interface City {
  id: string;
  name: string;
  asciiName: string;
  countryIso2: string;
  regionCode?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  population?: number;
  alternateNames?: string[];
  lastUpdated: string;
}

export interface Region {
  code: string;
  countryIso2: string;
  name: string;
  type: string;
  parent?: string;
  lastUpdated: string;
}

export interface LanguageEntry {
  code: string;
  name: string;
}

export interface CurrencyEntry {
  code: string;
  name: string;
  namePlural: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
}

export interface TimezoneEntry {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}

export interface GeographicRegion {
  code: string;
  name: string;
}
