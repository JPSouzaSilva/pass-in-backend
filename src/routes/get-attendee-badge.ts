import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AttendeeRepository } from "../repositories/attendee-repository";
import { GetAttendeeBadgeUseCase } from "../use-cases/get-attendee-badge";
import { AttendeeNotFoundError } from "../errors/attendee-not-found";

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            attendee: z.object({
              name: z.string(),
              email: z.string(),
            })
          }),
          404: z.object({
            message: z.string()
          }),
          500: z.object({
            message: z.string()
          })
        }
      }
    }, async (request, reply) => {
      const { attendeeId } = request.params

      const attendeeRepository = new AttendeeRepository()
      const getAttendeeBadgeUseCase = new GetAttendeeBadgeUseCase(attendeeRepository)

      try {
        const { attendee } = await getAttendeeBadgeUseCase.execute({ attendeeId })

        const response = {
          attendee: {
            name: attendee.name,
            email: attendee.email
          }
        }
        
        reply.status(200).send(response)

      } catch (error) {
        if (error instanceof AttendeeNotFoundError) {
          reply.status(404).send({ message: error.message })
        }

        reply.status(500).send({ message: 'Internal Server Error'})
      }
      
    })
}