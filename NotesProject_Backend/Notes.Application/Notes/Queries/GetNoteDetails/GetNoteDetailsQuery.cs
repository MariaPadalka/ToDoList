using System;
using MediatR;
using Notes.Domain;

namespace Notes.Application.Notes.Queries.GetNoteDetails
{
    public class GetNoteDetailsQuery : IRequest<Note>
    {
        public Guid Id { get; set; }
    }
}
