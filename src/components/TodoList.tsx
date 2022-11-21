import * as React from "react";
import axios from "axios";
import type { Todo } from '../pages'
import { useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

const TodoTypes = {
    TODO: 'todo',
};

type TodoItemProps = {
    id: string;
    index: number;
    todo: Todo;
    todos: Todo[];
    moveTodo: (dragIndex: number, hoverIndex: number) => void;
    setTodo: (t: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps>  = ({ id, index, todo, todos, moveTodo, setTodo }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop<
        Todo,
        void,
        { handlerId: Identifier | null }
    >({
        accept: TodoTypes.TODO,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: Todo, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            moveTodo(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    })

    const [_, drag] = useDrag({
        type: TodoTypes.TODO,
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const handleDeleteTodo = async (id: string) => {
        await axios.delete("/api/deleteTodo", { data: { id } })
        window.location.reload();
    }

    const handleToggleTodo = async (id: string) => {
        const originalTodos = [...todos];
        const todo = originalTodos.find((todo: Todo) => todo.id === id);
        await axios.put("/api/markTodo", { id, completed: !todo?.completed })
        window.location.reload();
    }

    const handleEditTodo = (id: string) => {
        const currentTodo = todos.filter((todo) => todo.id === id)[0] as Todo;
        setTodo(currentTodo)
    }

    drag(drop(ref))

    return (
        <div className="task_container" key={todo.id} ref={ref} data-handler-id={handlerId}>
            <input
                type="checkbox"
                className="check_box"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
            />
            <p
                className={
                    todo.completed
                        ? "task_text" + " " + "line_through"
                        : "task_text"
                }
            >
                {todo.description}
            </p>
            <button
                onClick={() => handleEditTodo(todo.id)}
                className="edit_task"
            >
                &#9998;
            </button>
            <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="remove_task"
            >
                &#10006;
            </button>
        </div>
    )
}

const TodoList = ({ todos = [], moveTodo, setTodo }: { todos: Todo[], setTodo: (t: Todo) => void; moveTodo: (dragIndex: number, hoverIndex: number) => void }) => {
    return (
        <>
            {todos.map((todo, index) => <TodoItem key={todo.id} id={todo.id} index={index} todo={todo} todos={todos} moveTodo={moveTodo} setTodo={setTodo} />)}
            {todos.length === 0 && <h2 className="no_tasks">No todos</h2>}
        </>
    );
};

export default TodoList;