import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JwtPayload | null;

        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const bookings = await prisma.booking.findMany({
            where: { userId: decoded.userId },
            include: { activity: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
