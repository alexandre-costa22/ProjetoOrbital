export interface Spaceships {
  id: number | string;
  url: string;
  name: string;
  serialNumber: string;
  isPlaceholder: boolean;
  inSpace: boolean;
  timeInSpace: number;    
  timeDocked: number;       
  flightsCount: number;
  missionEndsCount: number;
  status: {
    id: number | string;
    name: string;
  };
  description: string;
  config: {
    id: number | string;
    url: string;
    name: string;
    type: {
      id: number | string;
      name: string;
    };
    agency: {
      id: number | string;
      url: string;
      name: string;
      type: string;
    };
    inUse: boolean;
    imageUrl: string;
  };
}
