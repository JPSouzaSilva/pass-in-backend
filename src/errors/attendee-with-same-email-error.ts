export class AttendeeWithSameEmailError extends Error {
  constructor() {
    super('Already exist a attendee with this email in this event')
  }
}