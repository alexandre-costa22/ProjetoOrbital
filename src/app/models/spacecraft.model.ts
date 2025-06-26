export interface GetSpaceshipsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  spaceships: Spaceship[];
}

export interface Spaceship {
  id: number;
  url: string;
  name: string;
  description: string;
  status: SpaceshipStatus;
  serialNumber: string;
  isPlaceholder: boolean;
  inSpace: boolean;
  timeInSpace: string;
  timeDocked: string;
  flightsCount: number;
  missionEndsCount: number;
  config: SpaceshipConfig;
}

export interface SpaceshipStatus {
  id: number;
  name: string;
}

export interface SpaceshipConfig {
  id: number;
  url: string;
  name: string;
  type: { id: number; name: string };
  agency: Agency;
  inUse: boolean;
  imageUrl: string;
}

export interface Agency {
  id: number;
  url: string;
  name: string;
  type: string;
}
