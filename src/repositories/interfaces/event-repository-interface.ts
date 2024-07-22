import { Prisma, Event } from "@prisma/client"; 

export interface GetEventResponse {
  id: string
  title: string
  slug: string
  details: string | null
  maximumAttendees: number | null
  _count: {
    attendees: number
  }
}
 
// '{ title: string; details: string | null; maximumAttendees: number | null; id: string; slug: string; _count: { attendees: number; }; } | null'

export interface IEventRepository {
  create(data: Prisma.EventCreateInput): Promise<Event>
  findSlug(slug: string): Promise<Event | null>
  findById(id: string): Promise<Event | null>
  getEvent(id: string): Promise<GetEventResponse | null>
}