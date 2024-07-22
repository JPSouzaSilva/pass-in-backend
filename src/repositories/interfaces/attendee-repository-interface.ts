import { Attendee } from "@prisma/client";

export interface RegisterAttendee {
  eventId: string
  name: string
  email: string
}

export interface IAttendeeRepository {
  register(data: RegisterAttendee): Promise<Attendee>
  findByEmail(email: string): Promise<Attendee | null>
  count(eventId: string): Promise<number>
}