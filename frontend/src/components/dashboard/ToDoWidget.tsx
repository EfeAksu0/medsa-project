'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, X, Check, Trash2, ListTodo } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ToDoItem {
    id: string;
    content: string;
    completed: boolean;
}

export function ToDoWidget() {
    const [todos, setTodos] = useState<ToDoItem[]>([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const fetchTodos = async () => {
        try {
            const res = await api.get('/todos');
            setTodos(res.data);
        } catch (error) {
            console.error('Failed to fetch todos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        try {
            const res = await api.post('/todos', { content: newItem });
            setTodos([res.data, ...todos]);
            setNewItem('');
        } catch (error) {
            console.error('Failed to add todo', error);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            // Optimistic update
            setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
            await api.patch(`/todos/${id}/toggle`);
        } catch (error) {
            console.error('Failed to toggle todo', error);
            // Revert on error would go here
        }
    };

    // Open Modal
    const requestDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    // Actual Delete Action
    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setTodos(todos.filter(t => t.id !== itemToDelete));
            await api.delete(`/todos/${itemToDelete}`);
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Failed to delete todo', error);
            alert('Failed to delete task');
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <ListTodo className="text-purple-400" size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Pre-Trade Protocol</h2>
                    <p className="text-xs text-gray-400">Your daily rules for success</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 min-h-0 custom-scrollbar mb-4">
                {loading ? (
                    <div className="text-center text-gray-500 py-4">Loading tasks...</div>
                ) : todos.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 italic">
                        No rules set yet. <br /> Add your first task below!
                    </div>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`
                                group flex items-center justify-between p-3 rounded-lg border transition-all
                                ${todo.completed
                                    ? 'bg-gray-800/30 border-gray-800 opacity-50'
                                    : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/30 hover:bg-gray-800'
                                }
                            `}
                        >
                            {/* Toggle Area - Clickable */}
                            <div
                                onClick={() => handleToggle(todo.id)}
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                            >
                                <div className={`
                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                    ${todo.completed
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                        : 'border-gray-600 group-hover:border-purple-400'
                                    }
                                `}>
                                    {todo.completed && <Check size={12} />}
                                </div>
                                <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                    {todo.content}
                                </span>
                            </div>

                            {/* Delete Button - Separate Sibling */}
                            <button
                                type="button"
                                onClick={(e) => requestDelete(todo.id, e)}
                                className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg ml-2 z-20 relative"
                                title="Delete Task"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleAdd} className="mt-auto relative z-10">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new rule..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-600"
                />
                <button
                    type="submit"
                    disabled={!newItem.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </form>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Rule"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Are you sure you want to remove this rule?
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
