import { supabase } from "../utils/supabaseClient";

// Get all todos
export async function getTodos() {
	const { data, error } = await supabase
		.from("todos")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data;
}

// Add todo
export async function addTodo(task) {
	const { data, error } = await supabase
		.from("todos")
		.insert([{ task }])
		.select();

	if (error) throw error;
	return data[0];
}

// Update todo
export async function updateTodo(id, updates) {
	const { data, error } = await supabase
		.from("todos")
		.update(updates)
		.eq("id", id)
		.select();

	if (error) throw error;
	return data[0];
}

// Delete todo
export async function deleteTodo(id) {
	const { error } = await supabase.from("todos").delete().eq("id", id);
	if (error) throw error;
}
