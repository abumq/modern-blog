import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { BlogPost } from './pages/BlogPost'
import { EditPost } from './pages/EditPost'
import { NewPost } from './pages/NewPost'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/post/:id" element={<BlogPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/new" element={<NewPost />} />
      </Route>
    </Routes>
  )
}

export default App