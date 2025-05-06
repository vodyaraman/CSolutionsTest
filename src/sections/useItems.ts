import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchItems, fetchState, saveState, sendReorder, type Item } from './api.js';

const LIMIT = 20;

export function useItems(search: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadItems = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    const res = await fetchItems(offset, LIMIT, search);
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.id));
      const unique = res.items.filter((item) => !existing.has(item.id));
      return [...prev, ...unique];
    });
    setOffset((prev) => prev + LIMIT);
    setHasMore(res.items.length === LIMIT);
    loadingRef.current = false;
  }, [offset, search, hasMore]);

  const toggleSelection = (id: number) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleReorder = (newItems: Item[], draggedIds: number[], targetId: number) => {
    setItems(newItems);
    sendReorder(draggedIds, targetId);
  };
  
  useEffect(() => {
    const t = setTimeout(() => {
      setItems([]);
      setOffset(0);
      setHasMore(true);
      loadingRef.current = false;
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const sync = async () => {
      await saveState(Array.from(selected));
    };
    sync();
  }, [selected]);

  useEffect(() => {
    const init = async () => {
      const state = await fetchState();
      setSelected(new Set(state.selected));
      setItems([]);
      setOffset(0);
      setHasMore(true);
      loadingRef.current = false;
    };
    init();
  }, []);
  

  return {
    items,
    selected,
    loadItems,
    toggleSelection,
    handleReorder,
    hasMore,
  };
}
