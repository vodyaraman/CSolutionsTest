import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Item } from './api.js';

interface Props {
  item: Item;
  selected: boolean;
  toggle: () => void;
}

const ItemRow: React.FC<Props> = ({ item, selected, toggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const className = `list__item${selected ? ' list__item--selected' : ''}`;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
    >
      <div className="list__item-checkbox" onClick={(e) => { e.stopPropagation(); toggle(); }}>
        {selected && <span className="list__item-checkmark">✔</span>}
      </div>
      <span className='list__item-title'>{item.label}</span>
      <span className="list__item-drag" {...listeners}>☰</span>
    </li>
  );
};

export default ItemRow;
