using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Notes.Application.Common.Exceptions;
using Notes.Domain;
using Notes.Application.Interfaces;

namespace Notes.Application.Notes.Commands.DeleteCommand
{
    public class DeleteNoteCommandHandler
        : IRequestHandler<DeleteNoteCommand, Unit>
    {
        private readonly INotesDbContext _dbContext;

        public DeleteNoteCommandHandler(INotesDbContext dbContext) =>
            _dbContext = dbContext;

        public async Task<Unit> Handle(DeleteNoteCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Notes
                .FindAsync(new object[] { request.Id }, cancellationToken);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Note), request.Id);
            }

            _dbContext.Notes.Remove(entity);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
