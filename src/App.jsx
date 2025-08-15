import React, { useEffect, useState } from "react";
import {
	addTodo,
	deleteTodo,
	getTodos,
	updateTodo,
} from "./services/todoService";

export default function App() {
	const [task, setTask] = useState("");
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Fetch todos on mount
	useEffect(() => {
		(async () => {
			try {
				const data = await getTodos();
				setTodos(data);
			} catch (err) {
				console.error("Error fetching todos:", err.message);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// Add todo
	const handleAdd = async () => {
		if (!task.trim()) return;
		setSaving(true);

		// Optimistic UI update
		const tempTodo = { id: Date.now(), task, is_complete: false };
		setTodos((prev) => [tempTodo, ...prev]);
		setTask("");

		try {
			const newTodo = await addTodo(task);
			setTodos((prev) => prev.map((t) => (t.id === tempTodo.id ? newTodo : t)));
		} catch (err) {
			console.error("Error adding todo:", err.message);
		} finally {
			setSaving(false);
		}
	};

	// Edit todo
	const handleEdit = async (id) => {
		const newTask = prompt("Edit task:");
		if (!newTask) return;
		try {
			const updated = await updateTodo(id, { task: newTask });
			setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
		} catch (err) {
			console.error("Error editing todo:", err.message);
		}
	};

	// Delete todo
	const handleDelete = async (id) => {
		if (!confirm("Delete this todo?")) return;
		const prevTodos = todos;
		setTodos((prev) => prev.filter((t) => t.id !== id));
		try {
			await deleteTodo(id);
		} catch (err) {
			console.error("Error deleting todo:", err.message);
			setTodos(prevTodos); // rollback on error
		}
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen flex justify-center">
			<div className="w-full max-w-xl">
				<h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
					My Todo List
				</h1>

				{/* Input */}
				<div className="flex flex-col sm:flex-row gap-3 mb-6">
					<input
						type="text"
						placeholder="Enter a task..."
						value={task}
						onChange={(e) => setTask(e.target.value)}
						className="flex-1 px-4 py-2 border rounded-lg shadow-sm"
					/>
					<button
						onClick={handleAdd}
						disabled={saving}
						className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
					>
						{saving ? "Saving..." : "Add"}
					</button>
				</div>

				{/* Todo List */}
				<div className="bg-white rounded-lg shadow-lg">
					<div className="px-5 py-4 border-b">
						<h2 className="text-lg font-semibold">Tasks</h2>
					</div>
					<div className="p-5 space-y-4">
						{loading ? (
							<p className="text-center text-gray-500">Loading...</p>
						) : todos.length === 0 ? (
							<p className="text-center text-gray-500">No todos yet.</p>
						) : (
							todos.map((t) => (
								<div
									key={t.id}
									className="flex justify-between items-center border-b last:border-none pb-2"
								>
									<span>{t.task}</span>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(t.id)}
											className="text-blue-500 hover:underline"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(t.id)}
											className="text-red-500 hover:underline"
										>
											Delete
										</button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
