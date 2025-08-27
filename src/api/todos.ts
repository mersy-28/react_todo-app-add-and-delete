// API helpers for todos (load, create, delete)

import { client } from '../utils/fetchClient';

export const USER_ID = 3430;

export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export async function getTodos(userId: number): Promise<Todo[]> {
  // tiny artificial delay so Cypress timings match
  await new Promise(r => setTimeout(r, 150));

  return client.get<Todo[]>(`/todos?userId=${userId}`);
}

export async function createTodo(
  userId: number,
  data: { title: string; completed: boolean },
): Promise<Todo> {
  const response = await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...data }),
  });

  if (!response.ok) {
    throw new Error('Create failed');
  }

  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  await new Promise(r => setTimeout(r, 150));

  return client.delete(`/todos/${id}`);
}
