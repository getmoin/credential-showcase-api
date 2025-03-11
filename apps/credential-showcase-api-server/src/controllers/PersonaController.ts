import {
  BadRequestError,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put
} from 'routing-controllers'
import { Service } from 'typedi'
import {
  instanceOfPersonaRequest,
  PersonaRequest,
  PersonaRequestToJSONTyped,
  PersonaResponse,
  PersonaResponseFromJSONTyped,
  PersonasResponse,
  PersonasResponseFromJSONTyped,
} from 'credential-showcase-openapi'
import PersonaService from '../services/PersonaService'
import { personaDTOFrom } from '../utils/mappers'

@JsonController('/personas')
@Service()
class PersonaController {
  constructor(private personaService: PersonaService) {}

  @Get('/')
  public async getAll(): Promise<PersonasResponse> {
    try {
      const result = await this.personaService.getAll()
      const personas = result.map((persona) => personaDTOFrom(persona))
      return PersonasResponseFromJSONTyped({ personas }, false)
    } catch (e) {
      console.error(`getAll failed:`, e)
      return Promise.reject(e)
    }
  }

  @Get('/:id')
  public async get(@Param('id') id: string): Promise<PersonaResponse> {
    try {
      const result = await this.personaService.get(id)
      return PersonaResponseFromJSONTyped({ persona: personaDTOFrom(result) }, false)
    } catch (e) {
      if (e.httpCode !== 404) {
        console.error(`get id=${id} failed:`, e)
      }
      return Promise.reject(e)
    }
  }

  @HttpCode(201)
  @Post('/')
  public async post(@Body() personaRequest: PersonaRequest): Promise<PersonaResponse> {
    try {
      if (!instanceOfPersonaRequest(personaRequest)) {
        return Promise.reject(new BadRequestError())
      }
      const result = await this.personaService.create(PersonaRequestToJSONTyped(personaRequest))
      return PersonaResponseFromJSONTyped({ persona: personaDTOFrom(result) }, false)
    } catch (e) {
      console.error(`post failed:`, e)
      return Promise.reject(e)
    }
  }

  @Put('/:id')
  public async put(@Param('id') id: string, @Body() personaRequest: PersonaRequest): Promise<PersonaResponse> {
    try {
      if (!instanceOfPersonaRequest(personaRequest)) {
        return Promise.reject(new BadRequestError())
      }
      const result = await this.personaService.update(id, PersonaRequestToJSONTyped(personaRequest))
      return PersonaResponseFromJSONTyped({ persona: personaDTOFrom(result) }, false)
    } catch (e) {
      if (e.httpCode !== 404) {
        console.error(`put id=${id} failed:`, e)
      }
      return Promise.reject(e)
    }
  }

  @OnUndefined(204)
  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.personaService.delete(id)
    } catch (e) {
      if (e.httpCode !== 404) {
        console.error(`delete id=${id} failed:`, e)
      }
      return Promise.reject(e)
    }
  }
}

export default PersonaController
