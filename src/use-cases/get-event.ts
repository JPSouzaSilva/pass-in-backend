import { EventNotFoundError } from "../errors/event-not-found-error"
import { IEventRepository } from "../repositories/interfaces/event-repository-interface"

interface GetEventUseCaseRequest {
  eventId: string
}

interface GetEventUseCaseResponse {
  id: string
  title: string
  slug: string
  details: string | null
  maximumAttendees: number | null
  attendeeAmount: number
}

export class GetEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute({ eventId }: GetEventUseCaseRequest): Promise<GetEventUseCaseResponse> {
    const event = await this.eventRepository.getEvent(eventId)

    if (!event) {
      throw new EventNotFoundError()
    }

    const { id, title, slug, details, maximumAttendees, _count } = event

    return {
      id,
      title,
      slug,
      details,
      maximumAttendees,
      attendeeAmount: _count.attendees
    }

    
  }
}