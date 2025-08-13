// import { NextResponse } from 'next/server';


// const AI_API_KEY = process.env.OPENROUTER_API_KEY  ||
//   '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';;


// const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// export async function POST(request) {
  
// if (!AI_API_KEY) {
//   console.error("❌ API Key is missing! Add OPENROUTER_API_KEY in Vercel settings.");
//   return NextResponse.json(
//     { success: false, error: "Server configuration error: Missing API key" },
//     { status: 500 }
//   );
// }

//   try {
  
//     const { symptoms, organ, language } = await request.json();


//     const model = 'gpt-3.5-turbo';

   
//     const response = await fetch(AI_API_URL, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${AI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model,
//         messages: [
//           {
//             role: 'system',
//             content: `You are a professional medical consultant. Provide a **complete medical consultation** based on the symptoms provided. 
// Your answer must include (do not skip any part):
// 1. **Possible diagnosis** with explanation.
// 2. **Specific medicine name** (mandatory) and its form (tablet, syrup, injection, etc.).
// 3. **Exact dosage** (e.g., 500mg) and how many times per day.
// 4. **Exact treatment duration** (in days or weeks).
// 5. Additional lifestyle or home care advice.

// ⚠️ It is mandatory to always include at least one real medicine name in your answer.
// Respond in ${language === 'en' ? 'English' : 'Arabic'}.
// Always make it clear this is only an example and not a replacement for visiting a real doctor.`

//           },
//           {
//             role: 'user',
//             content: `Symptoms: ${symptoms} in my ${organ}.`,
//           },
//         ],
//         temperature: 0.7,
//         max_tokens: 800,
//       }),
//     });


//     if (!response.ok) {
//       const errorDetails = await response.text();
//       throw new Error(`API Error ${response.status}: ${errorDetails}`);
//     }

//     const data = await response.json();


//     return NextResponse.json({
//       success: true,
//       model,
//       response: data.choices?.[0]?.message?.content || 'No response from AI.',
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }




















// ملف: src/app/api/ai-diagnosis/route.js
import { NextResponse } from 'next/server';

const AI_API_KEY = process.env.OPENROUTER_API_KEY ||
  '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';

const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request) {
  if (!AI_API_KEY) {
    console.error("❌ API Key is missing! Add OPENROUTER_API_KEY in environment variables.");
    return NextResponse.json(
      { success: false, error: "Server configuration error: Missing API key" },
      { status: 500 }
    );
  }

  try {
    const { symptoms, organ, language } = await request.json();

    const model = 'gpt-3.5-turbo';

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

⚠️ Always include at least one real medicine name.
Respond in ${language === 'en' ? 'English' : 'Arabic'}.
Always clarify this is only an example and not a replacement for visiting a real doctor.`
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

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API Error ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();

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
