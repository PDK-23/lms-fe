export interface Stat {
  id: string;
  label: string;
  value: string;
  delta?: string;
}

export interface RecentEnrollment {
  id: string;
  user: string;
  course: string;
  date: string;
}

export interface RecentCourse {
  id: string;
  title: string;
  instructor: string;
  students: number;
  price: number;
}

export interface Dashboard {
  stats: Stat[];
  weeklyLabels: string[];
  weeklyActive: number[];
  categoryLabels: string[];
  categoryEnrollments: number[];
  subscriptionLabels: string[];
  subscriptionData: number[];
  recentEnrollments: RecentEnrollment[];
  recentCourses: RecentCourse[];
}
