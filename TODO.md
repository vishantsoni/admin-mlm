# TODO - Fix reply flow of ticket - attach file flow

- [x] Inspect current reply payload/attachment handling between `TicketDetail` -> page -> `useSupportTickets.replyToTicket`.
- [x] Implement fix: ensure attachment selected in `TicketDetail` is included in `onReply` call payload and handled by pages and `useSupportTickets`.
- [x] Update props/types to match real payload (use `FormData`).
- [x] Ensure admin and my-tickets pages both pass correct payload to `replyToTicket`.
- [ ] Run TypeScript/Next build or lint to confirm no type errors.

