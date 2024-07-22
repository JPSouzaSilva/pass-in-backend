import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { EventRepository } from "../repositories/event-repository";
import { GetEventUseCase } from "../use-cases/get-event";
import { EventNotFoundError } from "../errors/event-not-found-error";

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
    schema: {
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object({
          id: z.string().uuid(),
          title: z.string(),
          slug: z.string(),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().nullable(),
          attendeeAmount: z.number(),
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params

    const eventRepository = new EventRepository()
    const getEventUseCase = new GetEventUseCase(eventRepository)
    
    try {
      const event = await getEventUseCase.execute({eventId})

      reply.status(200).send(event)
    } catch (error) {
      if (error instanceof EventNotFoundError) {
        reply.status(404).send({ message: error.message })
      }
      
      reply.status(500).send({ message: 'Internal Server Error'})
    }


  })
}