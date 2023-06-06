using System;
using MediatR;
using static Notes.Domain.Note;

namespace Notes.Application.Notes.Commands.CreateNote
{
    public class CreateNoteCommand : IRequest<Guid>
    {
        public string Title { get; set; }
        public string Details { get; set; }
    }
}
