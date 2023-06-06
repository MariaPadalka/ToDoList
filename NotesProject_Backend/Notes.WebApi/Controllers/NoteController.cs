using AutoMapper;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Notes.Application.Notes.Queries.GetNoteList;
using Notes.Application.Notes.Queries.GetNoteDetails;
using Notes.Application.Notes.Commands.CreateNote;
using Notes.Application.Notes.Commands.UpdateNote;
using Notes.Application.Notes.Commands.DeleteCommand;
using Notes.WebApi.Models;
using Microsoft.EntityFrameworkCore;
using Notes.Persistence;
using Notes.Domain;

namespace Notes.WebApi.Controllers
{
    //[ApiVersion("1.0")]
    //[ApiVersion("2.0")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class NoteController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly NotesDbContext _dbContext;

        public NoteController(IMapper mapper) => _mapper = mapper;

        /// <summary>
        /// Gets the list of notes
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// GET /note
        /// </remarks>
        /// <returns>Returns NoteListVm</returns>
        /// <response code="200">Success</response>
        [HttpGet("getAll")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<NoteListVm>> GetAll()
        {
            //var notes = _dbContext.Notes.ToList();
            var query = new GetNoteListQuery{};
            var vm = await Mediator.Send(query);
            return Ok(vm);
            //return Ok(notes);
        }

        /// <summary>
        /// Gets the note by id
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// GET /note/D34D349E-43B8-429E-BCA4-793C932FD580
        /// </remarks>
        /// <param name="id">Note id (guid)</param>
        /// <returns>Returns NoteDetailsVm</returns>
        /// <response code="200">Success</response>
        [HttpGet("get/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<Note>> Get(Guid id)
        {
            var query = new GetNoteDetailsQuery
            {
                Id = id
            };
            var vm = await Mediator.Send(query);
            return Ok(vm);
        }

        /// <summary>
        /// Creates the note
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// POST /note
        /// {
        ///     title: "note title",
        ///     details: "note details"
        /// }
        /// </remarks>
        /// <param name="createNoteDto">CreateNoteDto object</param>
        /// <returns>Returns id (guid)</returns>
        /// <response code="201">Success</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<Guid>> Create([FromBody] CreateNoteDto createNoteDto)
        {
            var command = _mapper.Map<CreateNoteCommand>(createNoteDto);
            var noteId = await Mediator.Send(command);
            return Ok(noteId);
        }

        /// <summary>
        /// Updates the note
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// PUT /note
        /// {
        ///     title: "updated note title"
        /// }
        /// </remarks>
        /// <param name="updateNoteDto">UpdateNoteDto object</param>
        /// <returns>Returns NoContent</returns>
        /// <response code="204">Success</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Update([FromBody] UpdateNoteDto updateNoteDto)
        {
            var command = _mapper.Map<UpdateNoteCommand>(updateNoteDto);
            await Mediator.Send(command);
            return NoContent();
        }

        /// <summary>
        /// Deletes the note by id
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// DELETE /note/88DEB432-062F-43DE-8DCD-8B6EF79073D3
        /// </remarks>
        /// <param name="id">Id of the note (guid)</param>
        /// <returns>Returns NoContent</returns>
        /// <response code="204">Success</response>
        [HttpDelete("delete/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteNoteCommand
            {
                Id = id,
            };
            await Mediator.Send(command);
            return NoContent();
        }
    }
}
