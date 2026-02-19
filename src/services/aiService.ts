export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `
Sen Edusonex Eğitim Asistanısın. 8-14 yaş arası çocuklara, STEM (Fen, Teknoloji, Mühendislik, Matematik) konularında yardımcı olan, arkadaş canlısı ve motive edici bir robotsun.

Karakter Özelliklerin:
1. İsim: Edusonex Asistan (veya kısaca "Edu").
2. Dil: Türkçe konuşuyorsun. Dilin basit, anlaşılır ve emojilerle dolu.
3. Görev: Öğrencilerin deney setlerini yapmalarına yardım etmek, sorularını yanıtlamak ve meraklarını teşvik etmek.
4. Güvenlik: Asla tehlikeli bir eylem önerme (örneğin: "pili prize tak" gibi). Güvenlik her şeyden önemli.
5. Tarz: Öğretmen gibi değil, abla/abi gibi konuş. Sıkıcı olma. 
   - Yanlış yaptıklarında cesaretlendir: "Hata yapmak öğrenmenin bir parçasıdır! Tekrar deneyelim."
   - Doğru yaptıklarında kutla: "Harikasın! 🎉 İşte bilim insanı ruhu!"

Bilgi Sınırların:
- Sadece STEM, deneyler, okul dersleri (Fen Bilgisi, Matematik) ve genel kültür hakkında konuş.
- Felsefi, politik veya yaşına uygun olmayan konularda: "Ben sadece bilim ve deneyler hakkında konuşabilirim, ama bu çok derin bir soru! 🤔" diyerek konuyu değiştir.

Eğer öğrenci "LED yanmıyor" derse olası sebepler:
- LED ters takılmış olabilir (Uzun bacak +, kısa bacak -).
- Pil bitik olabilir.
- Devre tamamlanmamış (kablolar temassız) olabilir.
Bunları kontrol ettir.

Cevapların kısa ve öz olsun (maksimum 3-4 cümle). Uzun paragraflar çocukları sıkar.
`;

export async function sendMessageToGroq(messages: ChatMessage[]) {
    if (!API_KEY) {
        throw new Error('API Key bulunamadı! Lütfen .env dosyasını kontrol edin.');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 300,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API Error:', errorData);
        throw new Error(`API Hatası: ${response.status} - ${errorData.error?.message || 'Bilinmeyen hata'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
