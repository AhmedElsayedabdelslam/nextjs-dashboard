// import { NextResponse } from 'next/server';

// const AI_API_KEY = process.env.OPENROUTER_API_KEY || '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';
// const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// export async function POST(request) {
//   try {
//     const { condition, language } = await request.json();

//     const model = 'gpt-3.5-turbo'; // Using a more advanced model for medical info

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
//             content: `You are a professional pharmacist with extensive knowledge of medications worldwide. 
// Provide detailed information about medications for ${condition} including:

// 1. **Brand Names**: List 3-5 common brand names in different countries
// 2. **Generic Names**: Include international nonproprietary names
// 3. **Forms Available**: Tablets, capsules, injections, syrups, etc.
// 4. **Dosages**: Standard dosages for adults and children
// 5. **Side Effects**: Common and serious side effects
// 6. **Contraindications**: Who should not take this medication
// 7. **Manufacturers**: Major pharmaceutical companies that produce it
// 8. **Price Range**: Approximate cost in USD, EUR, and local currencies
// 9. **Storage Requirements**: How to store the medication properly
// 10. **Pregnancy Category**: Safety during pregnancy/breastfeeding

// Format the response in clear sections with bold headings. Include all details in ${language === 'en' ? 'English' : 'Arabic'}.

// Important: Always mention this is for informational purposes only and medical advice should come from a doctor.`
//           },
//           {
//             role: 'user',
//             content: `Provide complete medication information for: ${condition}`
//           },
//         ],
//         temperature: 0.5, // Lower temperature for more factual responses
//         max_tokens: 1500, // Allow longer responses for comprehensive info
//       }),
//     });

//     if (!response.ok) {
//       const errorDetails = await response.text();
//       throw new Error(`API Error ${response.status}: ${errorDetails}`);
//     }

//     const data = await response.json();

//     return NextResponse.json({
//       success: true,
//       response: data.choices?.[0]?.message?.content || 'No response from AI',
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }





















import { NextResponse } from 'next/server';

const AI_API_KEY = process.env.OPENROUTER_API_KEY;



const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request) {
  
if (!AI_API_KEY) {
  console.error("❌ API Key is missing! Add OPENROUTER_API_KEY in Vercel settings.");
  return NextResponse.json(
    { success: false, error: "Server configuration error: Missing API key" },
    { status: 500 }
  );
}

  try {
    const { condition, language } = await request.json();

    const model = 'gpt-3.5-turbo'; // Using the most advanced model available

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
            content: `You are a world-class pharmaceutical expert with access to global medication databases. 
Provide comprehensive information about medications for ${condition} in ${language === 'en' ? 'English' : 'Arabic'}.

Structure your response with these exact section headers (include all sections):

**Brand Names:**
- List 5-7 brand names from different countries (format: **Country**: Brand1, Brand2)
- Include major international brands

**Generic Names:**
- List all generic/chemical names
- Include IUPAC names where relevant

**Forms Available:**
- All available formulations (tablets, injections, etc.)
- Standard package sizes

**Dosages:**
- Adult dosages (standard and maximum)
- Pediatric dosages (by weight/age)
- Elderly dosage considerations

**Side Effects:**
- Common side effects (frequency >1%)
- Serious side effects (require medical attention)
- Organ system affected

**Contraindications:**
- Absolute contraindications
- Relative contraindications
- High-risk populations

**Manufacturers:**
- Top 5 global manufacturers
- Country of origin for each

**Price Range:**
- Cost in USD, EUR, and local currencies
- Price range for different forms

**Storage Requirements:**
- Temperature requirements
- Light sensitivity
- Shelf life

**Pregnancy Category:**
- FDA pregnancy category
- Lactation safety
- Fertility considerations

**Mechanism of Action:**
- Pharmacodynamics overview
- Biochemical pathways affected

**Pharmacokinetics:**
- Absorption, distribution, metabolism, excretion
- Half-life and time to peak effect

**Drug Interactions:**
- Major interaction categories
- Specific dangerous combinations
- Food interactions

**Monitoring Requirements:**
- Required blood tests
- Clinical monitoring parameters
- Toxicity signs

Format the response with clear markdown headers. Include all details in ${language === 'en' ? 'English' : 'Arabic'}.

Important: Add this disclaimer in ${language === 'en' ? 'English' : 'Arabic'} at the end:
"THIS INFORMATION IS FOR EDUCATIONAL PURPOSES ONLY. CONSULT A QUALIFIED HEALTHCARE PROFESSIONAL BEFORE TAKING ANY MEDICATION."`
          },
          {
            role: 'user',
            content: `Provide complete medication information for: ${condition}`
          },
        ],
        temperature: 0.3, // Lower temperature for more factual responses
        max_tokens: 2000, // Allow longer responses for comprehensive info
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API Error ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response from AI';

    return NextResponse.json({
      success: true,
      response: content,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
