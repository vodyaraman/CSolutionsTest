const API = import.meta.env.PUBLIC_API_URL;

export type Item = {
    id: number;
    label: string;
};

export const fetchItems = async (
    offset: number,
    limit: number,
    search: string,
): Promise<{ total: number; items: Item[] }> => {
    const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        search,
    });

    const res = await fetch(`${API}/items?${params.toString()}`);
    return res.json();
};

export const fetchState = async () => {
    const res = await fetch(`${API}/state`);
    return res.json();
};

export const saveState = async (selected: number[]) => {
    await fetch(`${API}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected }),
    });
};

export const sendReorder = async (draggedIds: number[], targetId: number) => {
    await fetch(`${API}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draggedIds, targetId }),
    });
};

