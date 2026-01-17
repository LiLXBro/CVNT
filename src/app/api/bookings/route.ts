import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function POST(req: Request) {
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

        const { activityId } = await req.json();

        if (!activityId) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        // Use a transaction to ensure consistency
        const result = await prisma.$transaction(async (tx) => {
            const activity = await tx.activity.findUnique({
                where: { id: activityId },
                include: { _count: { select: { bookings: true } } },
            });

            if (!activity) {
                throw new Error('Activity not found');
            }

            if (activity._count.bookings >= activity.capacity) {
                throw new Error('Activity is full');
            }

            const existingBooking = await tx.booking.findFirst({
                where: {
                    userId: decoded.userId,
                    activityId: activityId,
                },
            });

            if (existingBooking) {
                throw new Error('You have already booked this activity');
            }

            const booking = await tx.booking.create({
                data: {
                    userId: decoded.userId,
                    activityId: activityId,
                },
            });

            return booking;
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
        console.error('Error creating booking:', error);
        if (error.message === 'Activity not found') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error.message === 'Activity is full' || error.message === 'You have already booked this activity') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
