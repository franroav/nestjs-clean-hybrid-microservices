import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto'; // Define these DTOs

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    async create(@Body() createClientDto: CreateClientDto, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
        return this.clientService.insertClient(createClientDto, idTrace, consumer);
    }

    @Patch(':id')
    async update(@Param('id') clientId: string, @Body() updateClientDto: UpdateClientDto, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
        return this.clientService.updateClient(clientId, updateClientDto, idTrace, consumer);
    }

    @Delete(':id')
    async remove(@Param('id') clientId: string, @Param('idTrace') idTrace: string) {
        return this.clientService.deleteClient(clientId, idTrace);
    }

    @Get(':id')
    async findOne(@Param('id') clientId: string, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
        return this.clientService.getClient(clientId, idTrace, consumer);
    }

    // Similar routes for getClientByCommerceUserIdAndApp, getClientByEmail, etc.
}
