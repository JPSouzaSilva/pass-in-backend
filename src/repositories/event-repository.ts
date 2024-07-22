import { Event, Prisma } from "@prisma/client";
import { GetEventResponse, IEventRepository } from "./interfaces/event-repository-interface";
import { prisma } from "../lib/prisma";


export class EventRepository implements IEventRepository {
  async getEvent(id: string): Promise<GetEventResponse | null> {
    return await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          select: {
            attendees: true,
          }
        },
      },
      where: {
        id,
      }
    })

    
  }
  async findById(id: string): Promise<Event | null> {
    return await prisma.event.findFirst({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      where: {
        id
      }
    })
  }
  async findSlug(slug: string): Promise<Event | null> {
    return await prisma.event.findUnique({
      where: {
        slug
      }
    })

  }
  async create(data: Prisma.EventCreateInput): Promise<Event> {
    const { title, details, maximumAttendees, slug } = data

    return await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendees,
        slug
      }
    })
  }
  
}