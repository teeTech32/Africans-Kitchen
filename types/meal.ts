export type Meal = {
  id: number;
  createdAt: Date;
  slug: string;
  title: string;
  image: string;
  summary: string;
  instructions: string;
  updatedAt: Date;
  userId: number;
  userEmail: string;
  userName: string; 
};

export type MealDataResponse = {
  data: Meal[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}