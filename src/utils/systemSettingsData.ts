
import { supabase } from '@/integrations/supabase/client';
import { SystemSettingsData } from '@/types/systemSettings';

export const getSystemSettingsData = async (): Promise<SystemSettingsData> => {
    const { data, error } = await supabase.from('system_settings').select('key, value');
    if (error) {
        
        return {} as SystemSettingsData;
    }

    const settings = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as any);

    return settings;
};
