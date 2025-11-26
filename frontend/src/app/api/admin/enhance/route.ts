import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { description, care_notes } = await req.json();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Call our Edge Function via Supabase client for auth handling if needed,
    // or just fetch it directly if it's public. 
    // Since it's an admin action, invoking via function invoke is cleaner if we had session auth,
    // but for now we'll just hit the function URL.
    
    const { data, error } = await supabase.functions.invoke('enhanceDescription', {
      body: { description, care_notes },
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Enhance API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

