import { Alert, Box, CircularProgress, Divider, Link, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import formatDate from '../tools/formatDate'
import Post from '../types/Post'
import CommentsList from './CommentsList'

type ParamsType = {
	id: string
}

const PostPage: FC = () => {
	const {id} = useParams<ParamsType>()
	const [post, setPost] = useState<Post | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [commentsCount, setCommentsCount] = useState<number>(0)

	const fetchPost = () => {
		fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`, {
			method: 'GET'
		}).then((res) => {
				if (!res.ok) {
					throw new Error(`Something went wrong! Status code: ${res.status}`)
				}
				return res.json()
			})
			.then((data: Post) => {
				setPost(data)
				setError(null)
			})
			.catch((err) => {
				setError(err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		setLoading(true)

		fetchPost()
	}, [])

	const handleCommentsCount = (count: number) => {
		setCommentsCount((prev) => prev + count)
	}

	return (
		<>
			{loading
				? <Box py='1em' display='flex' justifyContent='center'>
					<CircularProgress color='inherit' />
				</Box>
				: error || !post
					? <Alert severity='error' sx={{width: '100%', my: '1em'}} variant='filled'>
						{error || 'Post not found.'}
					</Alert>
					: post
						? <>
							<Box py='1em'>
								<Typography variant='h4'>{post.title}</Typography>
							</Box>
							<Divider />
							<Typography py='0.5em'>
								Author: @{post.by} | Created at: {formatDate(new Date(post.time * 1000))} | <Link
								href={post.url}
								target='_blank'
							>Open post</Link> | Rating: {post.score} | Comments: {commentsCount}
							</Typography>
							<Divider />
							<CommentsList commentIds={post.kids || []} setCommentsCount={handleCommentsCount} />
						</>
						: null
			}
		</>
	)
}

export default PostPage
