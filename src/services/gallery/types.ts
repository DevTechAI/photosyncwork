
import { v4 as uuidv4 } from "uuid";

export interface Gallery {
  id: string;
  name: string;
  eventId: string;
  clientName: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  galleryId: string;
  url: string;
  thumbnail: string;
  selected: boolean;
  favorite: boolean;
}

export interface RecognizedPerson {
  id: string;
  galleryId: string;
  name: string;
  referencePhotoId: string | null;
  faceCount: number; // Calculated field
}
