import { invalidDataError, notFoundError } from "@/errors";
import { enrollmentRepository } from "@/repositories";
import { TicketsRepository } from "@/repositories/tickets-repository";


async function getTicketsByUser(userId: number) {
    if (!userId) throw notFoundError
    const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollmentId)throw notFoundError()

    const result = await TicketsRepository.findById(userId)
    if (!result) throw notFoundError()
    return result
  }
  
  async function getTicketsTypes() {
    return await TicketsRepository.findTicketsType()
  }
  
  async function postTicket(userId: number, ticketTypeId: number) {
    if(!ticketTypeId)throw invalidDataError ("ticketTypeId não foi enviado")
    if(!userId)throw notFoundError()
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError()
    const ticket = TicketsRepository.getTicketTypeById(ticketTypeId);
    if (!ticket) throw notFoundError();

    return await TicketsRepository.newTicket(ticketTypeId, enrollment.id)}

  
  export const ticketsServices = { getTicketsByUser, getTicketsTypes, postTicket };