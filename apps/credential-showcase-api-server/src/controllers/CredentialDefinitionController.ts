import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put } from 'routing-controllers'
import { Service } from 'typedi'
import {
  CredentialDefinitionRequest,
  CredentialDefinitionResponse,
  CredentialDefinitionResponseFromJSONTyped,
  CredentialDefinitionsResponse,
  CredentialDefinitionsResponseFromJSONTyped,
} from 'credential-showcase-openapi'
import CredentialDefinitionService from '../services/CredentialDefinitionService'
import { credentialDefinitionDTOFrom, credentialDefinitionFrom } from '../utils/mappers'

@JsonController('/credentials/definitions')
@Service()
export class CredentialDefinitionController {
  constructor(private credentialDefinitionService: CredentialDefinitionService) {}

  @Get('/')
  public async getAll(): Promise<CredentialDefinitionsResponse> {
    try {
      const result = await this.credentialDefinitionService.getCredentialDefinitions()
      const credentialDefinitions = result.map((credentialDefinition) => credentialDefinitionDTOFrom(credentialDefinition))
      return CredentialDefinitionsResponseFromJSONTyped({ credentialDefinitions }, false)
    } catch (e) {
      console.error('getAll definitions failed:', e)
      return Promise.reject(e)
    }
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string): Promise<CredentialDefinitionResponse> {
    try {
      const result = await this.credentialDefinitionService.getCredentialDefinition(id)
      return CredentialDefinitionResponseFromJSONTyped({ credentialDefinition: credentialDefinitionDTOFrom(result) }, false)
    } catch (e) {
      console.error(`getOne definition id=${id} failed:`, e)
      return Promise.reject(e)
    }
  }

  @HttpCode(201)
  @Post('/')
  public async post(@Body() credentialDefinitionRequest: CredentialDefinitionRequest): Promise<CredentialDefinitionResponse> {
    try {
      const result = await this.credentialDefinitionService.createCredentialDefinition(credentialDefinitionFrom(credentialDefinitionRequest))
      return CredentialDefinitionResponseFromJSONTyped({ credentialDefinition: credentialDefinitionDTOFrom(result) }, false)
    } catch (e) {
      console.error('credentialDefinitionRequest post failed:', e)
      return Promise.reject(e)
    }
  }

  @Put('/:id')
  public async put(@Param('id') id: string, @Body() credentialDefinitionRequest: CredentialDefinitionRequest): Promise<CredentialDefinitionResponse> {
    try {
      // Convert DTO to domain model
      const result = await this.credentialDefinitionService.updateCredentialDefinition(id, credentialDefinitionFrom(credentialDefinitionRequest))
      return CredentialDefinitionResponseFromJSONTyped({ credentialDefinition: credentialDefinitionDTOFrom(result) }, false)
    } catch (e) {
      console.error(`put definition id=${id} failed:`, e)
      return Promise.reject(e)
    }
  }

  @OnUndefined(204)
  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.credentialDefinitionService.deleteCredentialDefinition(id)
    } catch (e) {
      console.error(`delete definition id=${id} failed:`, e)
      return Promise.reject(e)
    }
  }
}
