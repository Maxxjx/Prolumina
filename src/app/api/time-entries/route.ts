import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// TimeEntry service with database implementation
const timeEntryService = {
  getTimeEntries: async () => {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        include: {
          user: true,
          task: true
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        userId: entry.userId,
        taskId: entry.taskId,
        projectId: entry.task?.projectId,
        description: entry.description,
        date: entry.date.toISOString(),
        startTime: entry.startTime?.toISOString(),
        endTime: entry.endTime?.toISOString(),
        duration: entry.duration,
        billable: entry.billable,
        user: entry.user ? {
          id: entry.user.id,
          name: entry.user.name,
          email: entry.user.email,
          image: entry.user.image
        } : null,
        task: entry.task ? {
          id: entry.task.id,
          title: entry.task.title
        } : null,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    }
  },
  
  getTimeEntriesByUserId: async (userId: string) => {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { userId },
        include: {
          user: true,
          task: true
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        userId: entry.userId,
        taskId: entry.taskId,
        projectId: entry.task?.projectId,
        description: entry.description,
        date: entry.date.toISOString(),
        startTime: entry.startTime?.toISOString(),
        endTime: entry.endTime?.toISOString(),
        duration: entry.duration,
        billable: entry.billable,
        user: entry.user ? {
          id: entry.user.id,
          name: entry.user.name,
          email: entry.user.email,
          image: entry.user.image
        } : null,
        task: entry.task ? {
          id: entry.task.id,
          title: entry.task.title
        } : null,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching time entries by user:', error);
      throw error;
    }
  },
  
  getTimeEntriesByTaskId: async (taskId: number) => {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { taskId },
        include: {
          user: true,
          task: true
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        userId: entry.userId,
        taskId: entry.taskId,
        projectId: entry.task?.projectId,
        description: entry.description,
        date: entry.date.toISOString(),
        startTime: entry.startTime?.toISOString(),
        endTime: entry.endTime?.toISOString(),
        duration: entry.duration,
        billable: entry.billable,
        user: entry.user ? {
          id: entry.user.id,
          name: entry.user.name,
          email: entry.user.email,
          image: entry.user.image
        } : null,
        task: entry.task ? {
          id: entry.task.id,
          title: entry.task.title
        } : null,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching time entries by task:', error);
      throw error;
    }
  },
  
  createTimeEntry: async (data: any) => {
    try {
      const timeEntry = await prisma.timeEntry.create({
        data: {
          userId: data.userId,
          taskId: data.taskId,
          description: data.description,
          date: new Date(data.date || data.startTime || new Date()),
          startTime: new Date(data.startTime || new Date()),
          endTime: data.endTime ? new Date(data.endTime) : null,
          duration: data.duration,
          minutes: data.minutes || 0,
          billable: data.billable || false
        },
        include: {
          user: true,
          task: true
        }
      });
      
      return {
        id: timeEntry.id,
        userId: timeEntry.userId,
        taskId: timeEntry.taskId,
        projectId: timeEntry.task?.projectId,
        description: timeEntry.description,
        date: timeEntry.date.toISOString(),
        startTime: timeEntry.startTime?.toISOString(),
        endTime: timeEntry.endTime?.toISOString(),
        duration: timeEntry.duration,
        billable: timeEntry.billable,
        user: timeEntry.user ? {
          id: timeEntry.user.id,
          name: timeEntry.user.name,
          email: timeEntry.user.email,
          image: timeEntry.user.image
        } : null,
        task: timeEntry.task ? {
          id: timeEntry.task.id,
          title: timeEntry.task.title
        } : null,
        createdAt: timeEntry.createdAt.toISOString(),
        updatedAt: timeEntry.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  },
  
  updateTimeEntry: async (id: number, data: any) => {
    try {
      const timeEntry = await prisma.timeEntry.update({
        where: { id },
        data: {
          description: data.description,
          date: data.date ? new Date(data.date) : undefined,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : null,
          minutes: data.minutes !== undefined ? data.minutes : undefined,
          duration: data.duration,
          billable: data.billable
        },
        include: {
          user: true,
          task: true
        }
      });
      
      return {
        id: timeEntry.id,
        userId: timeEntry.userId,
        taskId: timeEntry.taskId,
        projectId: timeEntry.task?.projectId,
        description: timeEntry.description,
        date: timeEntry.date.toISOString(),
        startTime: timeEntry.startTime?.toISOString(),
        endTime: timeEntry.endTime?.toISOString(),
        duration: timeEntry.duration,
        billable: timeEntry.billable,
        user: timeEntry.user ? {
          id: timeEntry.user.id,
          name: timeEntry.user.name,
          email: timeEntry.user.email,
          image: timeEntry.user.image
        } : null,
        task: timeEntry.task ? {
          id: timeEntry.task.id,
          title: timeEntry.task.title
        } : null,
        createdAt: timeEntry.createdAt.toISOString(),
        updatedAt: timeEntry.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  },
  
  deleteTimeEntry: async (id: number) => {
    try {
      await prisma.timeEntry.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting time entry:', error);
      return false;
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const taskId = searchParams.get('taskId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let timeEntries;
    
    if (userId) {
      timeEntries = await timeEntryService.getTimeEntriesByUserId(userId);
    } else if (taskId) {
      timeEntries = await timeEntryService.getTimeEntriesByTaskId(Number(taskId));
    } else if (startDate && endDate) {
      // Get time entries within date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      timeEntries = await prisma.timeEntry.findMany({
        where: {
          date: {
            gte: start,
            lte: end
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
    } else {
      timeEntries = await timeEntryService.getTimeEntries();
    }
    
    return NextResponse.json({ timeEntries });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    if (!body.taskId || !body.startTime) {
      return NextResponse.json(
        { error: 'Task ID and start time are required' },
        { status: 400 }
      );
    }
    
    const timeEntry = await timeEntryService.createTimeEntry({
      ...body,
      userId: session.user.id
    });
    
    return NextResponse.json(timeEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry' },
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
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Time entry ID is required' },
        { status: 400 }
      );
    }
    
    const timeEntry = await timeEntryService.updateTimeEntry(Number(id), data);
    
    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error('Error updating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to update time entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Time entry ID is required' },
        { status: 400 }
      );
    }
    
    const success = await timeEntryService.deleteTimeEntry(Number(id));
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete time entry' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete time entry' },
      { status: 500 }
    );
  }
}