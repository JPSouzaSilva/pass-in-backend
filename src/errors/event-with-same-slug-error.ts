export class EventWithSameSlugError extends Error {
  constructor() {
    super('Another event with same title already exists.')
  }
}