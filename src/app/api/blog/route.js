import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    const filter = {};
    if (category) filter.category = category;
    if (published === 'true') filter.isPublished = true;
    if (published === 'false') filter.isPublished = false;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.slug) {
      body.slug = generateSlug(body.title);
    }

    const existing = await Blog.findOne({ slug: body.slug });
    if (existing) {
      body.slug = `${body.slug}-${Date.now()}`;
    }

    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
