export type RegisterType = {
  email: string;
  password: string;
  username: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type CreatePromptType = {
  title: string;
  content: string;
  category: string;
};

export type Prompt = {
  id: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;

  votes: Vote[];

  userName: string;
};

export type Vote = {
  id: string;
  createdAt: string;
  userName: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  promptCount: number;
  voteCount: number;
};
