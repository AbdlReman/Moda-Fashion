import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug: params.slug }).lean();
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
