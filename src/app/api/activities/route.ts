import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: { date: 'asc' },
        });
        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JwtPayload | null;

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Optional: Check if user is admin
        // if (decoded.role !== 'admin') { ... } 
        // Requirement says "only authenticated user, optionally make admin-only". 
        // I'll stick to authenticated user for now as per requirement, but maybe add a comment.

        const { title, description, date, capacity } = await req.json();

        if (!title || !date || !capacity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                description,
                date: new Date(date),
                capacity: Number(capacity),
            },
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
