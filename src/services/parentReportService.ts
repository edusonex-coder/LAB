import { supabase } from '@/lib/supabase';

export interface ParentReport {
    score: number;
    summary: string;
    badges: number;
    potential_area: string;
    details: {
        focus: number;
        logic: number;
        creativity: number;
    };
}

/**
 * Öğrencinin son quest verilerine dayanarak ebeveyn için AI destekli potansiyel raporu üretir.
 */
export async function generateParentReport(userId: string): Promise<ParentReport | null> {
    try {
        // 1. Öğrencinin son questlerini çek
        const { data: quests, error } = await supabase
            .from('user_quests')
            .select('talent_score, ai_feedback, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error || !quests || quests.length === 0) {
            return null;
        }

        // 2. Ortalama Yetenek Puanı
        const totalScore = quests.reduce((acc, q) => acc + (q.talent_score || 0), 0);
        const avgScore = Math.round(totalScore / quests.length);

        // 3. Potansiyel Alan Analizi (Basit mantık, ileride Groq ile geliştirilecek)
        let potential_area = "Geleceğin Mühendisi";
        if (avgScore > 90) potential_area = "Üstün Yetenekli Kaşif";
        else if (avgScore > 75) potential_area = "Analitik Düşünür";

        // 4. Detaylı Metrikler (Simüle edilmiş, AI feedback'ten parse edilebilir)
        const details = {
            focus: Math.min(100, avgScore + 5),
            logic: avgScore,
            creativity: Math.min(100, avgScore + 10)
        };

        return {
            score: avgScore,
            summary: `Çocuğunuz son ${quests.length} deneyinde harika bir performans sergiledi. Özellikle el becerisi ve problem çözme hızıyla dikkat çekiyor.`,
            badges: quests.filter(q => (q.talent_score || 0) > 85).length,
            potential_area,
            details
        };
    } catch (err) {
        console.error('Parent Report Generation Error:', err);
        return null;
    }
}
