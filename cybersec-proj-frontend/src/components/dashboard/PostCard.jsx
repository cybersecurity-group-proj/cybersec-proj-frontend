'use client'
import Button from '@/components/ui/Button'

export default function PostCard({ post, isModerator, onDelete }) {
  return (
    <div 
      className="hover-lift transition-base rounded-lg p-6 mb-4"
      style={{
        backgroundColor: 'var(--background)',
        border: '1px solid var(--gray-light)'
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium mb-2">{post.author}</h3>
          <p className="text-gray-dark">{post.content}</p>
        </div>
        {(isModerator || post.isOwner) && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(post.id)}
            className="ml-4"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}