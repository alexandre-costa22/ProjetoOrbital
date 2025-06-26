// src/app/models/astronaut.model.ts

export interface GetAstronautsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  astronauts: Astronaut[];
}

export interface Astronaut {
  id: number;
  url: string;
  name: string;
  status: string;
  agencyName: string;
  agencyAbbrev: string;
  nationality: string;
  dateOfBirth: string | null;
  bio: string;
  wikiUrl: string;
  imageUrl: string;
  inSpace: boolean;
  timeInSpace: string;
}
