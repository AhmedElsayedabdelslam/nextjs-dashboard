import { NextResponse } from 'next/server';

// 🔑 مفتاح OpenRouter
const AI_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  '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';

// 🌐 رابط API
const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 📌 API Route
export async function POST(request) {
  try {
    // قراءة البيانات من الريكوست
    const { symptoms, organ, language } = await request.json();

    // الموديل ثابت هنا
    const model = 'gpt-3.5-turbo';

    // 📨 إرسال الطلب لـ OpenRouter
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are a professional medical consultant. Provide a **complete medical consultation** based on the symptoms provided. 
Your answer must include (do not skip any part):
1. **Possible diagnosis** with explanation.
2. **Specific medicine name** (mandatory) and its form (tablet, syrup, injection, etc.).
3. **Exact dosage** (e.g., 500mg) and how many times per day.
4. **Exact treatment duration** (in days or weeks).
5. Additional lifestyle or home care advice.

⚠️ It is mandatory to always include at least one real medicine name in your answer.
Respond in ${language === 'en' ? 'English' : 'Arabic'}.
Always make it clear this is only an example and not a replacement for visiting a real doctor.`

          },
          {
            role: 'user',
            content: `Symptoms: ${symptoms} in my ${organ}.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    // ❌ لو فيه خطأ من API
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API Error ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();

    // ✅ الرد النهائي
    return NextResponse.json({
      success: true,
      model,
      response: data.choices?.[0]?.message?.content || 'No response from AI.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
