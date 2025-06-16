import { z } from "zod";

import { queryCollectionOptions } from "@tanstack/db-collections";
import { createCollection } from "@tanstack/react-db";

import { queryClient } from "@/lib/query";

// Define schemas for your collections
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  done: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
});

// Export types for TypeScript
export type Task = z.infer<typeof TaskSchema>;
export type User = z.infer<typeof UserSchema>;

// Create collections with TanStack Query integration
export const taskCollection = createCollection<Task>(
  queryCollectionOptions({
    queryClient,
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      // This would fetch from your API endpoint
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
    getKey: (item: Task) => item.id,
    schema: TaskSchema,
    onInsert: async ({ transaction }: { transaction: any }) => {
      const { changes: newTask } = transaction.mutations[0];
      // Handle the local write by sending it to your API
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
    },
    onUpdate: async ({ transaction }: { transaction: any }) => {
      const { original, changes } = transaction.mutations[0];
      await fetch(`/api/tasks/${original.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    },
    onDelete: async ({ transaction }: { transaction: any }) => {
      const { original } = transaction.mutations[0];
      await fetch(`/api/tasks/${original.id}`, {
        method: "DELETE",
      });
    },
  })
);

export const userCollection = createCollection<User>(
  queryCollectionOptions({
    queryClient,
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    getKey: (item: User) => item.id,
    schema: UserSchema,
  })
);
