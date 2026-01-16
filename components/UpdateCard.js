'use client'

export default function UpdateCard({
  update,
  onEdit,
  onDelete,
  onPushNotification,
}) {
  return (
    <div className="update-card">
      {update.is_important && <div className="important-badge">IMPORTANT</div>}
      <h3>{update.title}</h3>
      <p className="update-content">{update.content}</p>
      <p className="update-meta">
        {new Date(update.created_at).toLocaleDateString()}
      </p>
      <div className="update-actions">
        <button onClick={onEdit} className="btn btn-secondary">
          Edit
        </button>
        <button onClick={onPushNotification} className="btn btn-success">
          Push Notification
        </button>
        <button onClick={onDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  )
}
