import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Notification service with database implementation
const notificationService = {
  getNotifications: async (userId: string) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId,
          read: false
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        entityId: notification.entityId,
        entityType: notification.entityType,
        read: notification.read,
        actionUrl: notification.actionUrl,
        createdAt: notification.createdAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  markAsRead: async (id: number) => {
    try {
      await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  createNotification: async (data: any) => {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title || '',
          message: data.message,
          type: data.type,
          entityId: data.entityId,
          entityType: data.entityType,
          read: false,
          actionUrl: data.actionUrl || null
        }
      });
      
      return {
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        entityId: notification.entityId,
        entityType: notification.entityType,
        read: notification.read,
        actionUrl: notification.actionUrl,
        createdAt: notification.createdAt.toISOString()
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const notifications = await notificationService.getNotifications(session.user.id);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    const success = await notificationService.markAsRead(Number(body.id));
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}