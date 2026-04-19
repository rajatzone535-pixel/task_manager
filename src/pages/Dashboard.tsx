import React, { useEffect, useState } from 'react';
import { taskService } from '../services/tasks';
import { Task, Status, Priority } from '../types';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Trash2,
  Edit2,
  Filter,
  ArrowRight,
  Loader,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('todo');
    setEditingTask(null);
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.due_date);
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, {
          title,
          description,
          due_date: dueDate,
          priority,
          status,
        });
      } else {
        await taskService.createTask({
          title,
          description,
          due_date: dueDate,
          priority,
          status,
          order_index: tasks.length,
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Status) => {
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const columns: { title: string; status: Status; icon: any; color: string }[] = [
    { title: 'To Do', status: 'todo', icon: Clock, color: 'text-blue-500' },
    { title: 'In Progress', status: 'in-progress', icon: Loader, color: 'text-amber-500' },
    { title: 'Completed', status: 'done', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Keep track of your projects and deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
          <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/20">
            <Plus size={18} className="mr-2" /> New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'bg-blue-500' },
          { label: 'To Do', value: stats.todo, color: 'bg-indigo-500' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-500' },
          { label: 'Completed', value: stats.done, color: 'bg-emerald-500' },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className={cn("absolute top-0 left-0 w-1 h-full", stat.color)} />
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", column.status === 'todo' ? "bg-blue-500" : column.status === 'in-progress' ? "bg-amber-500" : "bg-emerald-500")} />
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {tasks.filter(t => t.status === column.status).length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </div>

            <div className="flex flex-col gap-3 min-h-[200px]">
              {loading ? (
                Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                <AnimatePresence mode="popLayout">
                  {tasks
                    .filter(t => t.status === column.status)
                    .map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={handleOpenModal} 
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                </AnimatePresence>
              )}
              {!loading && tasks.filter(t => t.status === column.status).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl opacity-40">
                  <p className="text-sm">No tasks here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold font-display">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input 
                  label="Title" 
                  placeholder="What needs to be done?" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Add more details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Due Date" 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Priority</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {editingTask && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                    {['todo', 'in-progress', 'done'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s as Status)}
                        className={cn(
                          "px-2 py-2 text-xs font-medium rounded-md border transition-all",
                          status === s ? "bg-primary text-primary-foreground border-primary" : "bg-accent/50 hover:bg-accent"
                        )}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }: { 
  task: Task; 
  onEdit: (t: Task) => void; 
  onDelete: (id: string) => void;
  onStatusChange: (t: Task, s: Status) => void;
}) {
  const priorityColors = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", priorityColors[task.priority])}>
              {task.priority}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => onEdit(task)}>
                <Edit2 size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive" onClick={() => onDelete(task.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={12} className="mr-1" />
              {task.due_date ? format(new Date(task.due_date), 'MMM d') : 'No date'}
            </div>
            
            <div className="flex items-center gap-2">
              {task.status !== 'done' && (
                <button 
                  onClick={() => onStatusChange(task, task.status === 'todo' ? 'in-progress' : 'done')}
                  className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors"
                  title={task.status === 'todo' ? 'Move to In Progress' : 'Mark as Done'}
                >
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="h-32 w-full bg-accent/20 animate-pulse rounded-xl border border-border/50" />
  );
}
