import { createBrowserRouter } from 'react-router-dom'
import HomePage from './components/HomePage'
import Layout from './components/Layout'
import PostPage from './components/PostPage'
import './style.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <HomePage />
			},
			{
				path: ':id',
				element: <PostPage />
			}
		]
	}
])

export default router
