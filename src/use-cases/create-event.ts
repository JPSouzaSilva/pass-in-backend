import { EventWithSameSlugError } from "../errors/event-with-same-slug-error"
import { IEventRepository } from "../repositories/interfaces/event-repository-interface"
import { generateSlug } from "../utils/generate-slug"

interface CreateEventUseCaseRequest {
  title: string
  details: string | null
  maximumAttendees: number | null
}

interface CreateEventUseCaseResponse {
  eventId: string
}

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute({
    title,
    details,
    maximumAttendees
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const slug = generateSlug(title)

    const eventWithSameSlug = await this.eventRepository.findSlug(slug)

    if (eventWithSameSlug) {
      throw new EventWithSameSlugError()
    }

    const event = await this.eventRepository.create({ title, details, maximumAttendees, slug })

    return {
      eventId: event.id
    }
  }
}