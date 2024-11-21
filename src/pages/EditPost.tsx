import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api } from '../lib/api'
import type { Post } from '../types'

export function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<Post>()

  const { data: _, isLoading } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => api.get(`/posts/${id}`).then(res => res.data),
    onSuccess: (data: Post) => reset(data),
  })

  const mutation = useMutation({
    mutationFn: (data: Post) => api.put(`/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/')
    },
  })

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <form 
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Excerpt</label>
          <input
            {...register('excerpt')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            {...register('content')}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Post
        </button>
      </div>
    </form>
  )
}