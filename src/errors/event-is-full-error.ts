export class EventIsFullError extends Error {
  constructor() {
    super('Event is already full')
  }
}