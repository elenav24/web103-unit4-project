const BASE_URL = '/api/outfits';

async function handleResponse(res) {
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function getOptions() {
  const res = await fetch('/api/options');
  return handleResponse(res);
}

export async function getAllOutfits() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function getOutfitById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(res);
}

export async function createOutfit(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateOutfit(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteOutfit(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
