import { supabase } from '@/lib/supabase';

export interface Kit {
    id: string;
    serial_code: string;
    model_name: string;
}

export interface Activation {
    id: string;
    activated_at: string;
    kit: Kit;
}

export const kitService = {
    /**
     * Kod girerek yeni bir kit aktive eder
     */
    async activateKit(serialCode: string) {
        // 1. Önce kitin varlığını ve aktifliğini kontrol et
        const { data: kit, error: kitError } = await supabase
            .from('lab_kits')
            .select('*')
            .eq('serial_code', serialCode.toUpperCase())
            .single();

        if (kitError || !kit) throw new Error('Geçersiz kit kodu.');

        // 2. Aktivasyonu yap
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Oturum bulunamadı.');

        const { data: activation, error: activationError } = await supabase
            .from('kit_activations')
            .insert({
                user_id: user.user.id,
                kit_id: kit.id
            })
            .select()
            .single();

        if (activationError) {
            if (activationError.code === '23505') throw new Error('Bu kit zaten hesabınızda aktif.');
            throw activationError;
        }

        return activation;
    },

    /**
     * Kullanıcının aktif kitlerini getirir
     */
    async getMyKits() {
        const { data, error } = await supabase
            .from('kit_activations')
            .select(`
                id,
                activated_at,
                kit:lab_kits (
                    id,
                    serial_code,
                    model_name
                )
            `);

        if (error) throw error;
        return data as unknown as Activation[];
    },

    /**
     * Deney ilerlemesini günceller ve rozet kontrolü yapar
     */
    async updateProgress(experimentId: string, steps: number, isCompleted: boolean = false) {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return null;

        const userId = authData.user.id;

        const { data, error } = await supabase
            .from('user_experiment_progress')
            .upsert({
                user_id: userId,
                experiment_id: experimentId,
                completed_steps: steps,
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date().toISOString() : null
            }, { onConflict: 'user_id, experiment_id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Kullanıcının kazandığı rozetleri getirir
     */
    async getMyBadges() {
        const { data, error } = await supabase
            .from('user_badges')
            .select(`
                earned_at,
                badge:badges (*)
            `);

        if (error) throw error;
        return data;
    }
};
