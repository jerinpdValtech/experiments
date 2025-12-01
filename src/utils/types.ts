/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression } from "leaflet";

export interface Cabana {
  id: any;
  name: string;
  image?: string;
  position: any;   // ✅ Correct type
  capacity?: any;
  price?: number;
}