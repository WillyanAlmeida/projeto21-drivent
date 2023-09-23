import { notFoundError } from "@/errors";
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
  }
  
  export const ticketsServices = { getTicketsByUser, getTicketsTypes, postTicket };