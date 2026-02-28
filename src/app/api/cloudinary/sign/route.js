import crypto from 'crypto';

// Force dynamic rendering since this route generates dynamic signatures
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: 'Missing Cloudinary server credentials' }), { status: 500 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Sign only the timestamp (you can add folder/public_id/etc. if needed)
    const toSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return new Response(JSON.stringify({ timestamp, signature, apiKey, cloudName }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to create signature' }), { status: 500 });
  }
}


