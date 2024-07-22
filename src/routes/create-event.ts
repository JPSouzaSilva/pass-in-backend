import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { EventRepository } from "../repositories/event-repository";
import { CreateEventUseCase } from "../use-cases/create-event";
import { EventWithSameSlugError } from "../errors/event-with-same-slug-error";

export async function createEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events", {
      schema: {
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          }),
          409: z.object({
            message: z.string()
          })
        }
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;

      try {
        const eventRepository = new EventRepository();
        const createEventUseCase = new CreateEventUseCase(eventRepository);

        const eventId = await createEventUseCase.execute({
          title,
          details,
          maximumAttendees,
        });

        reply.status(201).send(eventId);
      } catch (error) {
        if (error instanceof EventWithSameSlugError) {
          reply.status(409).send({ message: error.message });
        }
        console.error(error);
        reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );
}
