import { Prisma, Attendee } from "@prisma/client";
import { IAttendeeRepository, RegisterAttendee } from "./interfaces/attendee-repository-interface";
import { prisma } from "../lib/prisma";

export class AttendeeRepository implements IAttendeeRepository {
  async count(eventId: string): Promise<number> {
    return await prisma.attendee.count({
      where: {
        eventId,
      }
    })
  }
  async findByEmail(email: string): Promise<Attendee | null> {
    const attendee = await prisma.attendee.findUnique({
      where: {
        email
      }
    })

    return attendee
  }
  async register(data: RegisterAttendee): Promise<Attendee> {
    const { eventId, email, name } = data

    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId,
      }
    })

    return attendee
  }  
}