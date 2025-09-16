export interface Interview {
  id?: string;
  position: string;
  description: string;
  experience: number;
  techStack: string;
  userId: string;
  questions?: Question[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Question {
  question: string;
  answer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}