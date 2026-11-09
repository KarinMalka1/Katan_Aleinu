import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = String(body.name || '').slice(0, 40);
    const ageMonths = Math.max(0, Math.min(84, Number(body.age_months) || 0));
    const priorities = Array.isArray(body.priorities) ? body.priorities.slice(0, 6).map((p) => String(p).slice(0, 30)) : [];
    const notes = String(body.notes || '').slice(0, 500);
    const photoUrl = typeof body.photo_url === 'string' && body.photo_url.startsWith('http') ? body.photo_url : null;

    const prompt = `את/ה יועץ/ת התפתחות הילד המסתמך/ת על מחקר מוכר (למשל AAP, CDC, WHO, הנחיות התפתחות מוקדמת).
ילד/ה: ${name || 'הילד'}, גיל ${ageMonths} חודשים (${(ageMonths / 12).toFixed(1)} שנים).
תחומי עדיפות להורה: ${priorities.join(', ') || 'כללי'}.
מידע נוסף: ${notes || 'אין'}.
${photoUrl ? 'מצורפת תמונה של הסיטואציה הנוכחית. נתח/י מה קורה בה והצע/י פעילות התפתחותית שאפשר לעשות ברגע הזה עם החפצים והסביבה שבתמונה.' : 'הצע/י פעילות התפתחותית קצרה (עד 5 דקות) שאפשר לשלב בשגרת היום, ללא ציוד מיוחד.'}
כתוב/י בעברית, בטון חם וקצר. הפעילות חייבת להתאים לגיל ולהיות בטוחה. אל תתן/י אבחנות רפואיות.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: photoUrl ? [photoUrl] : undefined,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'שם הפעילות, עד 6 מילים' },
          description: { type: 'string', description: '2-3 משפטים עם הוראות פשוטות' },
          why: { type: 'string', description: 'משפט אחד: מה זה מפתח ולמה, על בסיס מחקר' },
          minutes: { type: 'number' },
          domain: { type: 'string' },
        },
        required: ['title', 'description', 'why', 'minutes'],
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}