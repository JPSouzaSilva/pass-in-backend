export class AttendeeNotFoundError extends Error {
  constructor() {
    super('Attendee not found')
  }
}