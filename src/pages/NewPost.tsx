import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api } from '../lib/api'
import type { Post } from '../types'

export function NewPost() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit } = useForm<Omit<Post, 'id' | 'created_at'>>()

  const mutation = useMutation({
    mutationFn: (data: Omit<Post, 'id' | 'created_at'>) => 
      api.post('/posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/')
    },
  })

  return (
    <form 
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6"
    >
      <h1 className="text-2xl font-bold mb-6">New Post</h1>
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
          Create Post
        </button>
      </div>
    </form>
  )
}