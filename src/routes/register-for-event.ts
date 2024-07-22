import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AttendeeRepository } from "../repositories/attendee-repository";
import { RegisterAttendeeUseCase } from "../use-cases/register-attendee";
import { AttendeeWithSameEmailError } from "../errors/attendee-with-same-email-error";
import { EventRepository } from "../repositories/event-repository";
import { EventNotFoundError } from "../errors/event-not-found-error";
import { EventIsFullError } from "../errors/event-is-full-error";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          201: z.object({
            attendeeId: z.number()
          }),
          409: z.object({
            message: z.string()
          }),
          400: z.object({
            message: z.string()
          }),
          404: z.object({
            message: z.string()
          })
        }
      }
    }, async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      try {
        const eventRepository = new EventRepository()
        const attendeeRepository = new AttendeeRepository()
        const registerAttendeeUseCase = new RegisterAttendeeUseCase(attendeeRepository, eventRepository)

        const attendeeId = await registerAttendeeUseCase.execute({ eventId, email, name })

        reply.status(201).send(attendeeId)
      } catch (error) {
        if (error instanceof AttendeeWithSameEmailError) {
          reply.status(409).send({ message: error.message })
        }

        if (error instanceof EventNotFoundError) {
          reply.status(404).send({ message: error.message })
        }

        if (error instanceof EventIsFullError) {
          reply.status(400).send({ message: error.message })
        }

        reply.status(500).send({ message: 'Internal Server Error'})
      }

    })
}