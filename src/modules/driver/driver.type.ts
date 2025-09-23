import { Assignment } from "../assignment/assignment.type";

export type Driver = {
  id?: string;
  name?: string;
  licenseType?: string;
  availability?: boolean;
  lastAssignedAt?: Date;
  totalAssignments?: number;
  lat?: number;
  lng?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Assignment?: Assignment[];
};
