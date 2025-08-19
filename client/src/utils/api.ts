const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://clientdesk.onrender.com';

export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function fetchProjectById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
  if (!response.ok) throw new Error('Failed to fetch project');
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete project');
  return response.json();
}

// Project Notes API
export async function fetchProjectNotes(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/notes`);
  if (!response.ok) throw new Error('Failed to fetch project notes');
  return response.json();
}

export async function addProjectNote(projectId: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to add project note');
  return response.json();
}

// Project Timeline API
export async function fetchProjectTimeline(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/timeline`);
  if (!response.ok) throw new Error('Failed to fetch project timeline');
  return response.json();
}

export async function addProjectTimelineItem(projectId: string, title: string, description?: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/timeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) throw new Error('Failed to add project timeline item');
  return response.json();
}

export async function updateProjectTimelineItem(projectId: string, taskId: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/timeline/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update project timeline item');
  return response.json();
}

export async function updateProjectStatus(projectId: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update project status');
  return response.json();
}

