import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Clock, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import type { Post } from '../types'

export function Home() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => api.get('/posts').then(res => res.data),
  })

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <div className="space-y-10">
      {posts?.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 text-gray-500 mb-3">
            <Clock className="h-4 w-4" />
            <time>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            <Link to={`/post/${post.id}`} className="hover:text-indigo-600">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <div className="flex justify-between items-center">
            <Link
              to={`/post/${post.id}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              Read more
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to={`/edit/${post.id}`}
              className="text-gray-500 hover:text-gray-700"
            >
              Edit
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}