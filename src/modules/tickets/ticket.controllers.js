const ticketServices = require('./ticket.services');

exports.getTicketsController = async ( req, res ) => {
    try{
        const tickets = await ticketServices.getTickets();

        res.status(200).json(tickets);        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getTicketByIdController = async ( req, res ) => {
    try{   
        const id = parseInt(req.params.id);
        const ticket = await ticketServices.getTicketById(id);

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.createTicketController = async ( req ,res ) => {
    try{
        const userId = parseInt(req.params.id);
        const evento = req.body.evento;
        
        if (!evento) {
            return res.status(400).json({
                error: 'Campo obrigatório nome do evento não inserido.'
            });
        }

        const ticket = await ticketServices.createTicket( userId, evento );

        res.status(201).json({
            message: 'Ticket de evento criado com sucesso.',
            ticket
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.deleteTicketController = async ( req, res ) => {
    try{
        const id = parseInt(req.params.id);

        await ticketServices.deleteTicket(id);

        res.status(200).json({ message: `Ticket de evento ${id} deletado com sucesso.`});
    } catch (error){
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.updateTicketController = async ( req, res ) => {
    try{
        const id = parseInt(req.params.id);
        const evento = req.body.evento;

        const updatedTicket = ticketServices.updateTicket( id, evento );

        res.status(200).json({ message: 'Ticket de evento atualizado com sucesso', updatedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};