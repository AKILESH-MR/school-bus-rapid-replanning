const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchBuses() {
  const res = await fetch(`${API_BASE_URL}/buses`);
  if (!res.ok) throw new Error('Failed to fetch buses');
  return res.json();
}

export async function fetchDrivers() {
  const res = await fetch(`${API_BASE_URL}/drivers`);
  if (!res.ok) throw new Error('Failed to fetch drivers');
  return res.json();
}

export async function fetchStudents() {
  const res = await fetch(`${API_BASE_URL}/students`);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function fetchSchools() {
  const res = await fetch(`${API_BASE_URL}/schools`);
  if (!res.ok) throw new Error('Failed to fetch schools');
  return res.json();
}

export async function fetchRoutes() {
  const res = await fetch(`${API_BASE_URL}/routes`);
  if (!res.ok) throw new Error('Failed to fetch routes');
  return res.json();
}

export async function fetchDisruptions() {
  const res = await fetch(`${API_BASE_URL}/disruptions`);
  if (!res.ok) throw new Error('Failed to fetch disruptions');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE_URL}/audit`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function createDisruption(disruptionData) {
  const res = await fetch(`${API_BASE_URL}/disruptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disruptionData)
  });
  if (!res.ok) throw new Error('Failed to create disruption');
  return res.json();
}

export async function generateReplan(payload) {
  const res = await fetch(`${API_BASE_URL}/replans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to generate replan');
  return res.json();
}

export async function approveReplan(replanId, payload) {
  const res = await fetch(`${API_BASE_URL}/replans/${replanId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to approve replan');
  return res.json();
}

export async function rejectReplan(replanId, payload) {
  const res = await fetch(`${API_BASE_URL}/replans/${replanId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to reject replan');
  return res.json();
}

export async function modifyReplan(replanId, payload) {
  const res = await fetch(`${API_BASE_URL}/replans/${replanId}/modify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to modify replan');
  return res.json();
}

export async function syncOfflineActions(actions) {
  const res = await fetch(`${API_BASE_URL}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actions })
  });
  if (!res.ok) throw new Error('Failed to sync offline actions');
  return res.json();
}
