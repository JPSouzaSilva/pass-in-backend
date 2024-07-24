import { Attendee } from "@prisma/client";
import { AttendeeNotFoundError } from "../errors/attendee-not-found";
import { IAttendeeRepository } from "../repositories/interfaces/attendee-repository-interface";

interface GetAttendeeBadgeRequest {
  attendeeId: number
}

interface GetAttendeeBadgeResponse {
  attendee: Attendee
}

export class GetAttendeeBadgeUseCase {
  constructor(private attendeeRepository: IAttendeeRepository) {}

  async execute({ attendeeId }: GetAttendeeBadgeRequest): Promise<GetAttendeeBadgeResponse> {
    const attendee = await this.attendeeRepository.findById(attendeeId)

    if (!attendee) {
      throw new AttendeeNotFoundError()
    }

    return {
      attendee
    }
  }
}