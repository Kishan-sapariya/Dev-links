import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import HomePage from '@/components/HomePage';

async function getUser() {
  try {
    const cookieStore =await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true },
    });
    
    return user;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

export default async function Page() {
  const user = await getUser();
  
  return <HomePage user={user} />;
}
