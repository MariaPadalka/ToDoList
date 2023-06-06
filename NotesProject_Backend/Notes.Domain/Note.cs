using System;

namespace Notes.Domain
{
    public class Note
    {
        public enum NoteStatus
        {
            ToDo,
            InProgress,
            Done
        }
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Details { get; set; }
        public NoteStatus Status { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? EditDate { get; set; }
    }
}
