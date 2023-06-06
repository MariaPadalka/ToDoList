using System;
using MediatR;
using static Notes.Domain.Note;

namespace Notes.Application.Notes.Commands.UpdateNote
{
    public class UpdateNoteCommand : IRequest, IRequest<Unit>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public NoteStatus Status { get; set; }
    }
}
