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
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeeAmount: z.number(),
            })
          }),
          404: z.object({
            message: z.string()
          })
        }
      }
    }, async (request, reply) => {
      const { eventId } = request.params;

      const eventRepository = new EventRepository();
      const getEventUseCase = new GetEventUseCase(eventRepository);

      try {
        const eventData = await getEventUseCase.execute({ eventId });

        const response = {
          event: {
            id: eventData.id,
            title: eventData.title,
            slug: eventData.slug,
            details: eventData.details,
            maximumAttendees: eventData.maximumAttendees,
            attendeeAmount: eventData.attendeeAmount
          }
        };

        reply.status(200).send(response);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        
        reply.status(500).send({ message: 'Internal Server Error' });
      }
    });
}