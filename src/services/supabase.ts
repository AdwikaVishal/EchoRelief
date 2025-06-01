import { createClient } from '@supabase/supabase-js';
import type { SOSAlert, Resource, DisasterEvent } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// SOS Alerts
export const createSOSAlert = async (alert: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert([{
      ...alert,
      timestamp: new Date().toISOString(),
      status: 'new'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSOSStatus = async (id: string, status: SOSAlert['status']) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Resources
export const updateResourceStatus = async (
  id: string, 
  status: Resource['status'],
  assignedTo?: string
) => {
  const { data, error } = await supabase
    .from('resources')
    .update({ status, assignedTo })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Disasters
export const getActiveDisasters = async () => {
  const { data, error } = await supabase
    .from('disasters')
    .select('*')
    .eq('status', 'active');

  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToSOSAlerts = (callback: (alert: SOSAlert) => void) => {
  return supabase
    .channel('sos_alerts')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'sos_alerts'
    }, callback)
    .subscribe();
};

export const subscribeToResources = (callback: (resource: Resource) => void) => {
  return supabase
    .channel('resources')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'resources'
    }, callback)
    .subscribe();
};

export const subscribeToDisasters = (callback: (disaster: DisasterEvent) => void) => {
  return supabase
    .channel('disasters')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'disasters'
    }, callback)
    .subscribe();
};