import { AttendeeWithSameEmailError } from "../errors/attendee-with-same-email-error";
import { EventIsFullError } from "../errors/event-is-full-error";
import { EventNotFoundError } from "../errors/event-not-found-error";
import { IAttendeeRepository, RegisterAttendee } from "../repositories/interfaces/attendee-repository-interface";
import { IEventRepository } from "../repositories/interfaces/event-repository-interface";

interface RegisterAttendeeResponse {
  attendeeId: number
}

export class RegisterAttendeeUseCase {
  constructor(private attendeeRepository: IAttendeeRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute({
    eventId,
    name,
    email,
  }: RegisterAttendee): Promise<RegisterAttendeeResponse> {
    
    const [attendeeFromEmail, event, amountOfAttendeesForEvent] = await Promise.all([
      this.attendeeRepository.findByEmailInEvent(email, eventId),
      this.eventRepository.findById(eventId),
      this.attendeeRepository.count(eventId)
    ])

    if (attendeeFromEmail) {
      throw new AttendeeWithSameEmailError()
    }
    
    if (!event) {
      throw new EventNotFoundError()
    }
    
    const maxAttendees = event.maximumAttendees ?? Infinity

    if (amountOfAttendeesForEvent >= maxAttendees) {
      throw new EventIsFullError()
    }
    
    const attendee = await this.attendeeRepository.register({
      eventId,
      email,
      name,
    })

    return {
      attendeeId: attendee.id
    }
  }
}