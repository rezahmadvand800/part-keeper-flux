import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ShoppingItem } from '@/lib/validation';
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
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6 shadow-lg">
          <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">لیست خرید خالی است</h3>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          برای شروع، از دکمه <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mx-1">+</span> در پایین صفحه استفاده کنید
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
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 rounded-2xl transition-all duration-300 ${
              snapshot.isDraggingOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-transparent'
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
