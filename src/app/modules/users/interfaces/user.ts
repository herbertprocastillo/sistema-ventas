import {Timestamp} from "@angular/fire/firestore";

export interface User {
  id: string;
  email: string;
  role: string;
  displayName: string;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}
