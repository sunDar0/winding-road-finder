import { Course } from "./course";

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  courses: Course[];
}
