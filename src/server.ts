import fastify from "fastify"
import { createEvent } from "./routes/create-event"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"

const app = fastify()


app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)

app.listen({ port: 8080 }).then(() => {
  console.log('Server running on port 8080');
})