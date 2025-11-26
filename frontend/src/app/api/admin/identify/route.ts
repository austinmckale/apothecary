import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30; // Allow longer timeout for vision model

export async function POST(req: NextRequest) {
  try {
    const { image_base64 } = await req.json();

    if (!image_base64) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.functions.invoke('identifySpecies', {
      body: { image_base64 },
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Identify API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

