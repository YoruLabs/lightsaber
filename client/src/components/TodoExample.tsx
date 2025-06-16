import { useState } from "react";

import { useLiveQuery, useOptimisticMutation } from "@tanstack/react-db";

import { type Task, taskCollection } from "@/lib/db";
import { useGreeting } from "@/lib/grpc";

export function TodoExample() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [greetingName, setGreetingName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Live query for tasks - updates automatically when data changes
  const { data: tasks } = useLiveQuery(query =>
    query
      .from({ taskCollection })
      .where("@done", "=", false)
      .orderBy({ "@createdAt": "desc" })
      .select("@id", "@title", "@description", "@done")
  );

  // Example gRPC query
  const { data: greeting, isLoading: greetingLoading } = useGreeting(greetingName);

  // Optimistic mutation for adding tasks
  const addTask = useOptimisticMutation({
    mutationFn: async ({ transaction }) => {
      const { changes: newTask } = transaction.mutations[0];
      // This would call your actual API
      console.log("Adding task:", newTask);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    },
  });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    try {
      const newTask: Omit<Task, "id"> = {
        title: newTaskTitle,
        description: `Task created at ${new Date().toLocaleTimeString()}`,
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addTask.mutate(() =>
        taskCollection.insert({
          id: crypto.randomUUID(),
          ...newTask,
        })
      );

      setNewTaskTitle("");
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    taskCollection.update(taskId, draft => {
      draft.done = !draft.done;
      draft.updatedAt = new Date();
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TanStack DB + gRPC Demo</h1>

      {/* gRPC Example */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">gRPC Example</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={greetingName}
            onChange={e => setGreetingName(e.target.value)}
            placeholder="Enter your name"
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>
        {greetingLoading && <p>Loading greeting...</p>}
        {greeting && <p className="text-green-600">Response: {greeting.message}</p>}
      </div>

      {/* Task Management with TanStack DB */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Live Task List (TanStack DB)</h2>

        {/* Add Task Form */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={e => e.key === "Enter" && handleAddTask()}
          />
          <button
            onClick={handleAddTask}
            disabled={isAddingTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isAddingTask ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks?.map((task: any) => (
            <div
              key={task.id}
              className={`p-3 border rounded flex items-center justify-between ${
                task.done ? "bg-gray-100 line-through" : "bg-white"
              }`}
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <button
                onClick={() => handleToggleTask(task.id)}
                className={`px-3 py-1 rounded text-sm ${
                  task.done ? "bg-gray-300 text-gray-700" : "bg-green-500 text-white"
                }`}
              >
                {task.done ? "Undo" : "Done"}
              </button>
            </div>
          ))}

          {(!tasks || tasks.length === 0) && (
            <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>• Tasks are stored in TanStack DB with live queries</p>
        <p>• Changes update instantly with optimistic mutations</p>
        <p>• gRPC calls use Connect-ES with TanStack Query</p>
        <p>• Open React Query DevTools to see cache state</p>
      </div>
    </div>
  );
}
