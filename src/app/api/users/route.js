import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Force dynamic rendering since this route uses database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase(); // Now connects to 'test' database
    
    // Fetch users using User model (connection uses test database)
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Found ${users.length} users from database`);
    
    // Convert _id to id for frontend compatibility and remove passwordHash
    const formattedUsers = users.map(user => {
      const { passwordHash, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        id: user._id.toString(),
      };
    });
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectToDatabase(); // Now connects to 'test' database
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, country, education, height, weight, dateOfBirth, maritalStatus, gender, ethnicity, religion, hobbies, qualifications, occupation, aboutMe, role } = body || {};
    
    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ message: 'firstName, lastName, and email are required' }), { status: 400 });
    }
    
    if (!password || password.length < 6) {
      return new Response(JSON.stringify({ message: 'Password must be at least 6 characters' }), { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Save using User model (connection uses test database)
    const created = await User.create({ 
      firstName, 
      lastName, 
      email: email.toLowerCase(), 
      passwordHash,
      country: country || '',
      education: education || '',
      height: height || '',
      weight: weight || '',
      dateOfBirth: dateOfBirth || '',
      maritalStatus: maritalStatus || '',
      gender: gender || '',
      ethnicity: ethnicity || '',
      religion: religion || '',
      hobbies: hobbies || '',
      qualifications: qualifications || '',
      occupation: occupation || '',
      aboutMe: aboutMe || '',
      role: role || 'user' 
    });
    
    console.log('✅ User created in database:', created._id);
    
    // Remove passwordHash from response
    const { passwordHash: _, ...userResponse } = created.toObject();
    return new Response(JSON.stringify({ ...userResponse, id: userResponse._id.toString() }), { status: 201 });
  } catch (e) {
    console.error('Error creating user:', e);
    return new Response(JSON.stringify({ message: 'Failed to create user', error: e?.message }), { status: 400 });
  }
}


