'use client'

export default function SubmissionForm({ teamId, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle submission logic
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="submission-form">
      <div className="form-group">
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          type="text"
          placeholder="Enter your project name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Project Description</label>
        <textarea
          id="description"
          placeholder="Describe your project"
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="github-url">GitHub URL</label>
        <input
          id="github-url"
          type="url"
          placeholder="https://github.com/..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="demo-url">Demo URL</label>
        <input
          id="demo-url"
          type="url"
          placeholder="https://..."
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit Project
      </button>
    </form>
  )
}
