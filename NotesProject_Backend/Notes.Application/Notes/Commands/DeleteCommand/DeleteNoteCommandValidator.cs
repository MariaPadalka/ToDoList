using System;
using FluentValidation;

namespace Notes.Application.Notes.Commands.DeleteCommand
{
    public class DeleteNoteCommandValidator : AbstractValidator<DeleteNoteCommand>
    {
        public DeleteNoteCommandValidator()
        {
            RuleFor(deleteNoteCommand => deleteNoteCommand.Id).NotEqual(Guid.Empty);
        }
    }
}