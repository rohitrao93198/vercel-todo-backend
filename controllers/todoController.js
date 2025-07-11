import Todo from '../models/todo.js';

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const createTodo = async (req, res) => {
    try {
        const newTodo = new Todo({
            ...req.body,
            user: req.user.id, // 👈 link todo to logged-in user
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        await todo.deleteOne();

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

