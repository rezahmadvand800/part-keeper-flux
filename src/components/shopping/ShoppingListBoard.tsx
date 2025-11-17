import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ShoppingItem } from './ShoppingList';
import { ShoppingItemCard } from './ShoppingItemCard';

interface ShoppingListBoardProps {
  items: ShoppingItem[];
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onReorder: (items: ShoppingItem[]) => void;
}

export function ShoppingListBoard({ items, onEdit, onDelete, onReorder }: ShoppingListBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    onReorder(reorderedItems);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">لیست خرید خالی است</h3>
        <p className="text-sm text-muted-foreground">
          برای شروع، از دکمه + در پایین صفحه استفاده کنید
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="shopping-list" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 rounded-xl transition-colors ${
              snapshot.isDraggingOver ? 'bg-accent/20' : ''
            }`}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      width: item.width || 'auto',
                      height: item.height || 'auto',
                    }}
                  >
                    <ShoppingItemCard
                      item={item}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
