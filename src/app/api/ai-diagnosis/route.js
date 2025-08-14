
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
    console.log('🔹 POST route triggered');

    // قراءة البيانات من الريكوست
    let body;
    try {
      body = await request.json();
      console.log('🔹 Request body parsed:', body);
    } catch (err) {
      console.error('❌ Failed to parse JSON from request:', err);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { symptoms, organ, language } = body;

    // التحقق من الحقول المطلوبة
    if (!symptoms || !organ || !language) {
      console.warn('⚠️ Missing required fields:', { symptoms, organ, language });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: symptoms, organ, language' },
        { status: 400 }
      );
    }

    // الموديل ثابت
    const model = 'gpt-3.5-turbo';
    console.log('🔹 Using model:', model);

    // التحقق من وجود مفتاح API
    if (!AI_API_KEY) {
      console.error('❌ API Key is missing!');
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    console.log('🔹 Sending request to OpenRouter API...');
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

    console.log('🔹 Response status from OpenRouter API:', response.status);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('❌ OpenRouter API returned error:', errorDetails);
      throw new Error(`API Error ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();
    console.log('🔹 Response data from OpenRouter API:', data);

    return NextResponse.json({
      success: true,
      model,
      response: data.choices?.[0]?.message?.content || 'No response from AI.',
    });
  } catch (error) {
    console.error('❌ Unexpected error in POST route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
