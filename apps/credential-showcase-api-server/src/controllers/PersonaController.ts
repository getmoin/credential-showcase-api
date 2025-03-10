import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put } from 'routing-controllers'
import { Service } from 'typedi'
import {
  PersonasResponse,
  PersonasResponseFromJSONTyped,
  PersonaResponse,
  PersonaResponseFromJSONTyped,
  PersonaRequest,
  PersonaRequestToJSONTyped,
} from 'credential-showcase-openapi'
import PersonaService from '../services/PersonaService'
import { personaDTOFrom } from '../utils/mappers'

@JsonController('/personas')
@Service()
class PersonaController {
  constructor(private personaService: PersonaService) {}

  @Get('/')
  public async getAll(): Promise<PersonasResponse> {
    const result = await this.personaService.getAll()
    const personas = result.map((persona) => personaDTOFrom(persona))
    return PersonasResponseFromJSONTyped({ personas }, false)
  }

  @Get('/:slug')
  public async get(@Param('slug') slug: string): Promise<PersonaResponse> {
    const id = await this.personaService.getIdBySlug(slug)
    const result = await this.personaService.get(id)
    return PersonaResponseFromJSONTyped({ persona: personaDTOFrom(result) }, false)
  }

  @HttpCode(201)
  @Post('/')
  public async post(@Body() personaRequest: PersonaRequest): Promise<PersonaResponse> {
    const result = await this.personaService.create(PersonaRequestToJSONTyped(personaRequest))
    return PersonaResponseFromJSONTyped({ persona: personaDTOFrom(result) }, false)
  }

  @Put('/:slug')
  public async put(@Param('slug') slug: string, @Body() personaRequest: PersonaRequest): Promise<PersonaResponse> {
    const id = await this.personaService.getIdBySlug(slug)
    const result = await this.personaService.update(id, PersonaRequestToJSONTyped(personaRequest))
    return PersonaResponseFromJSONTyped({ persona: personaDTOFrom(result) }, false)
  }

  @OnUndefined(204)
  @Delete('/:slug')
  public async delete(@Param('slug') slug: string): Promise<void> {
    const id = await this.personaService.getIdBySlug(slug)
    return this.personaService.delete(id)
  }
}

export default PersonaController
