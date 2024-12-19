import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      theme: 'light',
      notifications: true,
      autoSave: true
    },
    notifications: {
      email: true,
      push: true,
      frequency: 'daily',
      types: ['progress', 'achievements']
    },
    curriculum: {
      defaultSubject: 'maths',
      defaultKeyStage: 2,
      adaptiveQuestions: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (settingsError) throw settingsError;
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: any) => {
    try {
      setLoading(true);
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', supabase.auth.user()?.id);

      if (updateError) throw updateError;
      setSettings(prev => ({ ...prev, general: newSettings }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = async (newSettings: any) => {
    try {
      setLoading(true);
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ notifications: newSettings })
        .eq('user_id', supabase.auth.user()?.id);

      if (updateError) throw updateError;
      setSettings(prev => ({ ...prev, notifications: newSettings }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    updateNotifications,
    loading,
    error
  };
}; 