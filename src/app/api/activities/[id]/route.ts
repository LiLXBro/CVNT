import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        const activity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        return NextResponse.json(activity);
    } catch (error) {
        console.error('Error fetching activity:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JwtPayload | null;

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
        }

        const id = parseInt((await params).id);
        const { title, description, date, capacity } = await req.json();

        const activity = await prisma.activity.update({
            where: { id },
            data: {
                title,
                description,
                date: date ? new Date(date) : undefined,
                capacity: capacity ? Number(capacity) : undefined,
            },
        });

        return NextResponse.json(activity);
    } catch (error) {
        console.error('Error updating activity:', error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JwtPayload | null;

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
        }

        const id = parseInt((await params).id);
        await prisma.activity.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
