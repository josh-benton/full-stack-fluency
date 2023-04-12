//async functions to handle API requests
async function getTasks() {
    const response = await fetch(`/api/tasks`);
    return await response.json();
}

async function getTasksById(id) {
    const response = await fetch(`/api/tasks/${id}`);
    return await response.json();
}

async function createTask(taskData) {
    const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });
    return await response.json();
}

async function updateTaskWithPatch(id, taskData) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });
    return await response.json();
}

async function updateTaskWithPut(id, taskData) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });
    return await response.json();
}

// async function deleteTask(id) {
//     const response = await fetch(`/api/tasks/${id}`, {
//         method: "DELETE"
//     });
//     console.log(response.status);
//     return response.status === 204;
// }

async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete task: ${errorText}`);
    }
    return true;
}

