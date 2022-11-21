import axios from "axios";
import { Todo } from "../pages";

interface NewTodoForm {
    todo: Todo;
    order: number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewTodoForm: React.FC<NewTodoForm> = ({ todo, order, handleChange }) => {
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const value = e.currentTarget[0].value;

        if (!value) return;

        if (todo.id) {
            console.log('handleSubmit UPDATE', e.currentTarget[0].value)
            await axios.post("/api/updateTodo", { id: todo.id, description: value })
        } else {
            console.log('handleSubmit CREATE', e.currentTarget[0].value)
            await axios.post("/api/addTodo", { description: value, order  })
        }

        window.location.reload();
    }

    return (
        <form onSubmit={handleSubmit} className="form_container">
            <input
                className="input"
                type="text"
                placeholder="Todo to be done..."
                onChange={handleChange}
                value={todo.description}
            />
            <button type="submit" className="submit_btn">
                {todo.id ? "Update" : "Add"}
            </button>
        </form>
    );
};

export default NewTodoForm;