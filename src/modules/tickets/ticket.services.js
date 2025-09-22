const prisma = require('../db/prisma');

const getTickets = async () => {
    try{
        const tickets = await prisma.ticket.findMany({
            include: { user: { select: { id: true, name: true, email: true } } }
        });
        return tickets;
    } catch (error) {
        console.error(`Erro ao recuperar as informações dos tickets de envento comprados pelo usuário ${error}`);
        throw error
    }
};

const getTicketById = async (id) => {
    try{
        const ticketId = parseInt(id);
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { user: { select: { id: true, name: true ,email: true } } }
        });

        if(!ticket){
            console.error(`Ticket de evento ${id} não encontrado`);
            return null;
        }

        return ticket;
    } catch (error) {
        console.error(`Erro ao buscar o ticket de evento ${error}`);
        throw error
    }
};

const createTicket = async ( userId, evento ) => {
    try {
        const usId = parseInt(userId);

        const ticket = await prisma.ticket.create({
            data: {
                event: evento,
                userId: usId
            }
        });

        return ticket;
    } catch (error) {
        console.error(`Erro ao criar ticket do evento ${error}`);
        throw error
    }
};

const deleteTicket = async (id) => {
    try{
        const ticketId = parseInt(id);
        const ticket = await getTicketById(ticketId);

        await prisma.ticket.delete({ where: { id: ticketId } });

        if (!ticket){
            console.error(`Ticket de evento ${ticketId} já não existia.`);
            return null;
        }

        return true;
    } catch (error) {
        console.error(`Erro ao deletar ticket de evento ${error}`);
        throw error
    }
};

const updateTicket = async ( id, evento ) => {
    try{
        const ticketId = parseInt(id);

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                event: evento,
                updatedAt: new Date().toISOString()
            }
        });

        return updatedTicket;
    } catch (error) {
        console.error(`Erro ao atualizar ticket de evento ${error}`);
        throw error
    } 
};

module.exports = {
    getTickets,
    getTicketById,
    createTicket, 
    deleteTicket,
    updateTicket
}