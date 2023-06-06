using System;
using MediatR;

namespace Notes.Application.Notes.Commands.DeleteCommand
{
    public class DeleteNoteCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
