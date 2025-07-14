export interface Expeditions {
    crew: Crew[];
    endDate: string;
    startDate: string;
    name: string;
  }
  
  export interface Crew {
    agency: string;
    name: string;
    role: Role[];
  }
  
  export interface Role {
    id: number;
    priority: number;
    role: string;
  }
  