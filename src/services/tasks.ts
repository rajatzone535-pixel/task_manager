import { supabase } from './supabase';
import { Task, Priority, Status } from '../types';

export const taskService = {
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Task[];
  },

  async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        user_id: user.id,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateTaskOrder(taskId: string, newOrder: number, newStatus?: Status) {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        order_index: newOrder,
        ...(newStatus ? { status: newStatus } : {})
      })
      .eq('id', taskId);

    if (error) throw error;
  }
};
