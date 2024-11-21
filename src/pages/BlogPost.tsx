import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import { marked } from 'marked'
import { api } from '../lib/api'
import type { Post } from '../types'

export function BlogPost() {
  const { id } = useParams()
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => api.get(`/posts/${id}`).then(res => res.data),
  })

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <article className="prose lg:prose-xl mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center space-x-2 text-gray-500 mb-4">
        <Clock className="h-4 w-4" />
        <time>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
      </div>
      <h1>{post.title}</h1>
      <div 
        dangerouslySetInnerHTML={{ __html: marked(post.content) }} 
        className="mt-6"
      />
    </article>
  )
}