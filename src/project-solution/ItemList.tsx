import React, { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useItems } from './useItems.js';
import { useIntersection } from './useIntersection.js';
import ItemRow from './ItemRow.js';
import FormInput from '@/components/inputs/FormInput.js';
import "./styles.scss";

const ItemsList: React.FC = () => {
    const [search, setSearch] = useState(() => '');
    const {
        items,
        selected,
        loadItems,
        toggleSelection,
        handleReorder,
        hasMore,
    } = useItems(search);

    const loadRef = useIntersection(() => {
        if (hasMore) loadItems();
    });

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
      
        const activeId = Number(active.id);
        const overId = Number(over.id);
      
        // Найти индексы
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);
      
        if (oldIndex === -1 || newIndex === -1) return;
      
        const newItems = arrayMove(items, oldIndex, newIndex);
        handleReorder(newItems, [activeId], overId);
      };
      

    return (
        <>
            <FormInput
                id='text'
                type="text"
                label="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <ul className='list'>
                        {items.map((item) => (
                            <ItemRow
                                key={item.id}
                                item={item}
                                selected={selected.has(item.id)}
                                toggle={() => toggleSelection(item.id)}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>

            <div ref={loadRef} style={{ height: 20 }} />
        </>
    );
};

export default ItemsList;
