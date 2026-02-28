import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User, { UserSchema } from '@/models/User';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Force dynamic rendering since this route uses database and file uploads
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const connection = await connectToDatabase();
    const dbName = connection.connection?.name;
    console.log('Registration - Current database:', dbName);
    
    if (dbName !== 'test') {
      console.error('❌ WARNING: Not connected to test database! Current:', dbName);
    }

    const form = await request.formData();
    
    // Extract form fields
    const firstName = form.get('firstName')?.toString() || '';
    const lastName = form.get('lastName')?.toString() || '';
    const email = form.get('email')?.toString() || '';
    const password = form.get('password')?.toString() || '';
    const country = form.get('country')?.toString() || '';
    const education = form.get('education')?.toString() || '';
    const height = form.get('height')?.toString() || '';
    const weight = form.get('weight')?.toString() || '';
    const dateOfBirth = form.get('dateOfBirth')?.toString() || '';
    const maritalStatus = form.get('maritalStatus')?.toString() || '';
    const gender = form.get('gender')?.toString() || '';
    const ethnicity = form.get('ethnicity')?.toString() || '';
    const religion = form.get('religion')?.toString() || '';
    const hobbies = form.get('hobbies')?.toString() || '';
    const qualifications = form.get('qualifications')?.toString() || '';
    const occupation = form.get('occupation')?.toString() || '';
    const aboutMe = form.get('aboutMe')?.toString() || '';
    
    // Get files
    const profilePhotoFile = form.get('profilePhoto');
    const identityDocumentFile = form.get('identityDocument');

    console.log('Registration - Files received:', {
      hasProfilePhoto: !!profilePhotoFile,
      hasIdentityDocument: !!identityDocumentFile,
      profilePhotoType: profilePhotoFile?.constructor?.name,
      profilePhotoSize: profilePhotoFile?.size,
      identityDocType: identityDocumentFile?.constructor?.name,
      identityDocSize: identityDocumentFile?.size,
    });

    // Basic validation
    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First and last name are required' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Ensure connected first
    await connectToDatabase();
    
    // Switch to 'test' database using useDb() (doesn't create new connection)
    const mongooseModule = await import('mongoose');
    const testDb = mongooseModule.default.connection.useDb('test');
    
    // Get or create User model for test database
    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      // Register the model on test database - use the exported schema directly
      TestUser = testDb.model('User', UserSchema);
    }
    
    // Check existing user in test database
    const existing = await TestUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Upload files to Cloudinary (optional - user will be created even if upload fails)
    let profilePhotoUrl = '';
    let profilePhotoPublicId = '';
    let identityDocumentUrl = '';
    let identityDocumentPublicId = '';
    
    // Check Cloudinary configuration only if files are present
    const hasFiles = (profilePhotoFile && (
      (profilePhotoFile instanceof File) ||
      (typeof profilePhotoFile === 'object' && (profilePhotoFile.size > 0 || profilePhotoFile.length > 0))
    )) || (identityDocumentFile && (
      (identityDocumentFile instanceof File) ||
      (typeof identityDocumentFile === 'object' && (identityDocumentFile.size > 0 || identityDocumentFile.length > 0))
    ));
    
    if (hasFiles) {
      const cloudinaryConfig = {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
      };
      
      console.log('Registration - Cloudinary config check:', {
        cloudName: cloudinaryConfig.cloudName ? 'SET' : 'MISSING',
        apiKey: cloudinaryConfig.apiKey ? 'SET' : 'MISSING',
        apiSecret: cloudinaryConfig.apiSecret
      });
      
      if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || cloudinaryConfig.apiSecret === 'MISSING') {
        console.warn('Cloudinary config missing, but continuing with registration (files will not be uploaded)');
      }
    }
    
    // Check if profile photo file was uploaded
    const hasProfilePhoto = profilePhotoFile && (
      (profilePhotoFile instanceof File) ||
      (typeof profilePhotoFile === 'object' && (profilePhotoFile.size > 0 || profilePhotoFile.length > 0))
    );
    
    if (hasProfilePhoto) {
      try {
        const fileInfo = {
          name: profilePhotoFile.name || profilePhotoFile.filename || 'unknown',
          size: profilePhotoFile.size || profilePhotoFile.length || 0,
          type: profilePhotoFile.type || profilePhotoFile.contentType || 'unknown',
          constructor: profilePhotoFile.constructor?.name || 'unknown'
        };
        
        console.log('Registration - Uploading profile photo to Cloudinary...', fileInfo);
        
        if (fileInfo.size === 0) {
          console.warn('⚠️ Profile photo file is empty, skipping upload');
        } else {
          console.log('🔵 Starting Cloudinary upload for profile photo...');
          const result = await uploadToCloudinary(profilePhotoFile, 'matrimonial/profile-photos');
          
          console.log('🔵 Cloudinary upload RAW result:', {
            hasResult: !!result,
            resultType: typeof result,
            resultKeys: result ? Object.keys(result) : 'NO RESULT',
            hasUrl: !!(result?.url),
            url: result?.url || 'NO URL',
            fullUrl: result?.url ? result.url : 'NO URL',
            hasPublicId: !!(result?.public_id),
            publicId: result?.public_id || 'NO PUBLIC ID'
          });
          
          // Verify we got a Cloudinary URL
          if (result && result.url) {
            const urlStr = String(result.url).trim();
            console.log('🔵 Raw URL from Cloudinary:', urlStr);
            console.log('🔵 URL validation:', {
              hasUrl: !!urlStr,
              length: urlStr.length,
              includesCloudinary: urlStr.includes('cloudinary.com'),
              includesLocalhost: urlStr.includes('localhost'),
              startsWithHttp: urlStr.startsWith('http')
            });
            
            if (urlStr && urlStr.includes('cloudinary.com') && !urlStr.includes('localhost')) {
              profilePhotoUrl = urlStr;
              profilePhotoPublicId = (result.public_id && String(result.public_id)) || '';
              console.log('✅ Profile photo uploaded - URL SET:', profilePhotoUrl);
              console.log('✅ Public ID SET:', profilePhotoPublicId);
              console.log('✅ URL type:', typeof profilePhotoUrl);
              console.log('✅ URL length:', profilePhotoUrl.length);
            } else {
              console.error('❌ Invalid Cloudinary URL:', {
                url: urlStr,
                includesCloudinary: urlStr.includes('cloudinary.com'),
                includesLocalhost: urlStr.includes('localhost'),
                isValid: urlStr && urlStr.includes('cloudinary.com') && !urlStr.includes('localhost')
              });
              throw new Error(`Invalid Cloudinary URL returned: ${urlStr}`);
            }
          } else {
            console.error('❌ No URL returned from Cloudinary upload');
            console.error('   Result object:', JSON.stringify(result, null, 2));
            throw new Error('No URL returned from Cloudinary');
          }
        }
      } catch (error) {
        console.error('❌ Registration - Error uploading profile photo:', {
          message: error.message,
          stack: error.stack,
          file: {
            name: profilePhotoFile?.name,
            size: profilePhotoFile?.size,
            type: profilePhotoFile?.type
          }
        });
        // Don't save profilePhotoUrl - it will be empty, and we won't save the filename either
        profilePhotoUrl = '';
        profilePhotoPublicId = '';
      }
    }
    
    // Check if identity document file was uploaded
    const hasIdentityDocument = identityDocumentFile && (
      (identityDocumentFile instanceof File) ||
      (typeof identityDocumentFile === 'object' && (identityDocumentFile.size > 0 || identityDocumentFile.length > 0))
    );
    
    if (hasIdentityDocument) {
      try {
        const fileInfo = {
          name: identityDocumentFile.name || identityDocumentFile.filename || 'unknown',
          size: identityDocumentFile.size || identityDocumentFile.length || 0,
          type: identityDocumentFile.type || identityDocumentFile.contentType || 'unknown',
          constructor: identityDocumentFile.constructor?.name || 'unknown'
        };
        
        console.log('Registration - Uploading identity document to Cloudinary...', fileInfo);
        
        if (fileInfo.size === 0) {
          console.warn('⚠️ Identity document file is empty, skipping upload');
        } else {
          console.log('🔵 Starting Cloudinary upload for identity document...');
          const result = await uploadToCloudinary(identityDocumentFile, 'matrimonial/identity-documents');
          
          console.log('🔵 Cloudinary upload RAW result:', {
            hasResult: !!result,
            resultType: typeof result,
            resultKeys: result ? Object.keys(result) : 'NO RESULT',
            hasUrl: !!(result?.url),
            url: result?.url || 'NO URL',
            fullUrl: result?.url ? result.url : 'NO URL',
            hasPublicId: !!(result?.public_id),
            publicId: result?.public_id || 'NO PUBLIC ID'
          });
          
          // Verify we got a Cloudinary URL
          if (result && result.url) {
            const urlStr = String(result.url).trim();
            console.log('🔵 Raw URL from Cloudinary:', urlStr);
            console.log('🔵 URL validation:', {
              hasUrl: !!urlStr,
              length: urlStr.length,
              includesCloudinary: urlStr.includes('cloudinary.com'),
              includesLocalhost: urlStr.includes('localhost'),
              startsWithHttp: urlStr.startsWith('http')
            });
            
            if (urlStr && urlStr.includes('cloudinary.com') && !urlStr.includes('localhost')) {
              identityDocumentUrl = urlStr;
              identityDocumentPublicId = (result.public_id && String(result.public_id)) || '';
              console.log('✅ Identity document uploaded - URL SET:', identityDocumentUrl);
              console.log('✅ Public ID SET:', identityDocumentPublicId);
              console.log('✅ URL type:', typeof identityDocumentUrl);
              console.log('✅ URL length:', identityDocumentUrl.length);
            } else {
              console.error('❌ Invalid Cloudinary URL:', {
                url: urlStr,
                includesCloudinary: urlStr.includes('cloudinary.com'),
                includesLocalhost: urlStr.includes('localhost'),
                isValid: urlStr && urlStr.includes('cloudinary.com') && !urlStr.includes('localhost')
              });
              throw new Error(`Invalid Cloudinary URL returned: ${urlStr}`);
            }
          } else {
            console.error('❌ No URL returned from Cloudinary upload');
            console.error('   Result object:', JSON.stringify(result, null, 2));
            throw new Error('No URL returned from Cloudinary');
          }
        }
      } catch (error) {
        console.error('❌ Registration - Error uploading identity document:', {
          message: error.message,
          stack: error.stack,
          file: {
            name: identityDocumentFile?.name,
            size: identityDocumentFile?.size,
            type: identityDocumentFile?.type
          }
        });
        // Don't save identityDocumentUrl - it will be empty, and we won't save the filename either
        identityDocumentUrl = '';
        identityDocumentPublicId = '';
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Debug: Check what we have before saving
    console.log('═══════════════════════════════════════════════');
    console.log('Registration - BEFORE saving to database:');
    console.log('Profile Photo URL:', profilePhotoUrl || 'EMPTY');
    console.log('Profile Photo Public ID:', profilePhotoPublicId || 'EMPTY');
    console.log('Identity Document URL:', identityDocumentUrl || 'EMPTY');
    console.log('Identity Document Public ID:', identityDocumentPublicId || 'EMPTY');
    console.log('═══════════════════════════════════════════════');

    // Prepare user data - only save Cloudinary URLs, not local filenames
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      country,
      education,
      height,
      weight,
      dateOfBirth,
      maritalStatus,
      gender,
      ethnicity,
      religion,
      hobbies,
      qualifications,
      occupation,
      aboutMe,
      role: 'user',
    };

    // Only add Cloudinary URLs if they were successfully uploaded - NO local filenames
    if (profilePhotoUrl && profilePhotoUrl.includes('cloudinary.com') && !profilePhotoUrl.includes('localhost')) {
      userData.profilePhotoUrl = profilePhotoUrl;
      userData.profilePhotoPublicId = profilePhotoPublicId || '';
      console.log('✅ Adding profilePhotoUrl to userData:', profilePhotoUrl.substring(0, 80) + '...');
    } else {
      console.error('❌ Profile photo URL is MISSING or INVALID!');
      console.error('   URL value:', profilePhotoUrl);
      console.error('   Contains cloudinary.com?', profilePhotoUrl?.includes('cloudinary.com'));
      console.error('   Contains localhost?', profilePhotoUrl?.includes('localhost'));
    }

    console.log('🔵 Checking identityDocumentUrl before saving:', {
      hasValue: !!identityDocumentUrl,
      valueType: typeof identityDocumentUrl,
      valueLength: identityDocumentUrl?.length,
      valuePreview: identityDocumentUrl ? identityDocumentUrl.substring(0, 100) : 'EMPTY',
      includesCloudinary: identityDocumentUrl?.includes('cloudinary.com'),
      includesLocalhost: identityDocumentUrl?.includes('localhost')
    });
    
    if (identityDocumentUrl && typeof identityDocumentUrl === 'string' && identityDocumentUrl.includes('cloudinary.com') && !identityDocumentUrl.includes('localhost')) {
      userData.identityDocumentUrl = String(identityDocumentUrl).trim();
      userData.identityDocumentPublicId = (identityDocumentPublicId ? String(identityDocumentPublicId).trim() : '') || '';
      console.log('✅ Adding identityDocumentUrl to userData:', userData.identityDocumentUrl.substring(0, 80) + '...');
      console.log('✅ userData.identityDocumentUrl type:', typeof userData.identityDocumentUrl);
      console.log('✅ userData.identityDocumentUrl length:', userData.identityDocumentUrl.length);
    } else {
      console.error('❌ Identity document URL is MISSING or INVALID!');
      console.error('   URL value:', identityDocumentUrl);
      console.error('   URL type:', typeof identityDocumentUrl);
      console.error('   Contains cloudinary.com?', identityDocumentUrl?.includes?.('cloudinary.com'));
      console.error('   Contains localhost?', identityDocumentUrl?.includes?.('localhost'));
    }

    // Debug: Show what we're about to save
    console.log('═══════════════════════════════════════════════');
    console.log('Registration - userData BEFORE saving:');
    console.log('Has profilePhotoUrl:', !!userData.profilePhotoUrl);
    console.log('Has identityDocumentUrl:', !!userData.identityDocumentUrl);
    console.log('userData keys:', Object.keys(userData));
    console.log('═══════════════════════════════════════════════');

    // Verify userData before saving
    console.log('🔍 Final userData before save:', {
      hasProfilePhotoUrl: !!userData.profilePhotoUrl,
      profilePhotoUrlLength: userData.profilePhotoUrl?.length || 0,
      profilePhotoUrlPreview: userData.profilePhotoUrl?.substring(0, 50) || 'NONE',
      hasIdentityDocumentUrl: !!userData.identityDocumentUrl,
      identityDocumentUrlLength: userData.identityDocumentUrl?.length || 0,
      identityDocumentUrlPreview: userData.identityDocumentUrl?.substring(0, 50) || 'NONE',
      allKeys: Object.keys(userData)
    });

    // Save user to test database (TestUser model was created earlier)
    const user = await TestUser.create(userData);
    
    // Debug: Show what was actually saved
    console.log('═══════════════════════════════════════════════');
    console.log('✅ User saved to test.users database:', user._id);
    console.log('Registration - AFTER saving (from database):');
    console.log('profilePhotoUrl:', user.profilePhotoUrl || 'EMPTY/MISSING');
    console.log('profilePhotoPublicId:', user.profilePhotoPublicId || 'EMPTY/MISSING');
    console.log('identityDocumentUrl:', user.identityDocumentUrl || 'EMPTY/MISSING');
    console.log('identityDocumentPublicId:', user.identityDocumentPublicId || 'EMPTY/MISSING');
    console.log('profilePhotoName:', user.profilePhotoName || 'EMPTY');
    console.log('identityDocumentName:', user.identityDocumentName || 'EMPTY');
    
    // Verify saved data matches what we intended to save
    if (userData.profilePhotoUrl && !user.profilePhotoUrl) {
      console.error('❌ WARNING: profilePhotoUrl was in userData but NOT saved to database!');
    }
    if (userData.identityDocumentUrl && !user.identityDocumentUrl) {
      console.error('❌ WARNING: identityDocumentUrl was in userData but NOT saved to database!');
    }
    console.log('═══════════════════════════════════════════════');

    console.log('✅ Registration successful - User ID:', user._id || user.id);

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user._id?.toString() || user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role || 'user',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Register error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


