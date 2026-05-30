/**
 * Canonical travel geography served by the Voyant Data geo API
 * (`/data/geo/v1`). One polymorphic place model — countries, regions, cities,
 * ports, and the waterway family (rivers/seas/oceans/canals/lakes) —
 * discriminated by `type`. `names` is a locale → name map (e.g. `{ en, ro }`).
 */

export type CanonicalPlaceType =
  | "region"
  | "country"
  | "subdivision"
  | "city"
  | "port"
  | "river"
  | "sea"
  | "ocean"
  | "canal"
  | "lake";

/** Place types that belong to the waterway family. */
export type WaterwayPlaceType = "river" | "sea" | "ocean" | "canal" | "lake";

export interface PlaceCoordinates {
  lat: number;
  lng: number;
}

/**
 * Type-specific fields carried in `CanonicalPlace.attributes`. The attribute
 * record is open; these interfaces document the per-type shapes for narrowing.
 */
export interface CountryAttributes {
  iso3?: string;
  numericCode?: string;
  currencies?: string[];
  languages?: string[];
  callingCode?: string;
  capital?: string;
  flagEmoji?: string;
  subregion?: string;
}

export interface CityAttributes {
  geonameId?: string;
  population?: number;
}

export interface WaterwayAttributes {
  wikidataId?: string;
  sitelinks?: number;
}

export interface PortAttributes {
  subdivision?: string;
  iata?: string;
}

export interface CanonicalPlace {
  /** Stable canonical id — ISO2 (country), UN/LOCODE (port), QID (waterway), … */
  id: string;
  type: CanonicalPlaceType;
  /** UN/LOCODE if applicable (e.g. `DEHAM`); a `ZZ` prefix denotes at-sea. */
  unlocode?: string;
  /** The single country a place belongs to; absent for multi-country rivers and regions/seas. */
  countryIso2?: string;
  parentId?: string;
  coordinates?: PlaceCoordinates;
  /**
   * Server-resolved display name for the requested language (the client `lang`
   * or a per-call `lang`), and the locale it was actually served in. Resolution
   * falls back requested language → English → any available name, so `name` is
   * always present on read responses. Configure the language once on the client
   * (`createVoyantDataClient({ lang: "ro" })`) and read `place.name`.
   */
  name?: string;
  nameLang?: string;
  /**
   * Locale → display name, e.g. `{ en: "Danube", ro: "Dunărea" }`. The full map;
   * pass `names: false` to a geo call to omit it when only `name` is needed.
   */
  names: Record<string, string>;
  aliases?: string[];
  attributes?: Record<string, unknown>;
}

/**
 * Response for `geo.places.get` — the place plus its outgoing relations grouped
 * by relation kind. The SDK transport camel-cases response keys, so a river's
 * `flows_through` relations are exposed under `relations.flowsThrough`
 * (e.g. `{ flowsThrough: ["DE", "AT", …] }`). The `?relation=` query param on
 * `related()` still takes the snake-case `PlaceRelationKind` the API expects.
 */
export interface PlaceWithRelations {
  data: CanonicalPlace;
  /** Camel-cased relation kind (e.g. `flowsThrough`) → related place ids. */
  relations: Record<string, string[]>;
}

export type PlaceRelationKind =
  | "flows_through"
  | "borders"
  | "part_of"
  | "near";

export interface PlaceRelation {
  placeId: string;
  relatedPlaceId: string;
  relation: PlaceRelationKind;
}

// ─── Resolve (provider label/code → canonical place) ───

export type PlaceMatchMethod =
  | "code"
  | "exact"
  | "alias"
  | "fuzzy"
  | "ai"
  | "none";

export interface PlaceResolveItem {
  label: string;
  providerCode?: string;
  countryHint?: string;
  typeHint?: CanonicalPlaceType;
  /** Previously resolved place on the same route — for distance sanity-checks. */
  previousPlaceId?: string;
}

export interface PlaceResolveRequest {
  items: PlaceResolveItem[];
}

export interface PlaceResolveMatch {
  place: CanonicalPlace | null;
  confidence: number;
  method: PlaceMatchMethod;
  /** True when the label is an at-sea / cruising entry, not a real place. */
  atSea?: boolean;
}

export interface PlaceResolveResult {
  results: PlaceResolveMatch[];
}

/**
 * Language controls shared by every geo read. `lang` overrides the client-level
 * language for one call; `names: false` drops the full `names` map from the
 * response (keeping only the resolved `name`). A `type` alias (not interface) so
 * it carries an implicit index signature and satisfies the transport's
 * QueryParams when passed as `query`.
 */
export type PlaceLangParams = {
  lang?: string;
  names?: boolean;
};

// A `type` alias (not interface) so it carries an implicit index signature and
// satisfies the transport's QueryParams when passed as `query`.
export type PlaceListParams = PlaceLangParams & {
  type?: CanonicalPlaceType;
  country?: string;
  parent?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

/**
 * Pick a place name in a preferred language from the `names` map, falling back
 * through `en` and then any available name. Prefer the server-resolved
 * `place.name` (set `lang` on the client or per call); reach for this helper to
 * re-resolve a different language client-side from a `names` map you already hold.
 */
export function placeName(
  place: Pick<CanonicalPlace, "names">,
  lang = "en",
  fallback = "en",
): string {
  const names = place.names ?? {};
  return names[lang] ?? names[fallback] ?? Object.values(names)[0] ?? "";
}
