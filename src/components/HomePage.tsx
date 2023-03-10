import RefreshIcon from '@mui/icons-material/Refresh'
import {
	Alert,
	Box,
	CircularProgress,
	Divider,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Snackbar,
	Tooltip,
	Typography
} from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import formatDate from '../tools/formatDate'
import Post from '../types/Post'

const HomePage: FC = () => {
	const [idList, setIdList] = useState<string[]>([])
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [fetchInterval, setFetchInterval] = useState<ReturnType<typeof setInterval> | null>(null)

	const fetchIds = () => {
		fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty', {
			method: 'GET'
		}).then((res) => {
				if (!res.ok) {
					throw new Error(`Something went wrong! Status code: ${res.status}`)
				}
				return res.json()
			})
			.then((data: string[]) => {
				setError(null)
				setIdList(data.slice(0, 100))
			})
			.catch((err) => {
				setError(err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const fetchPosts = () => {
		// Creating multiple requests using promise.all and array of posts id
		Promise.all(idList.map((id) => {
				return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((res) => res.json())
			}))
			.then((data: Post[]) => {
				setError(null)
				setPosts(data)
			})
			.catch((err) => {
				setError(err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		// Setting loading animation if posts didn't load at least once
		if (posts.length < 1) {
			setLoading(true)
		}
		fetchIds()

		// Setting interval for 1 minute to reload posts data
		const interval = setInterval(fetchIds, 60000)
		setFetchInterval(interval)

		return () => clearInterval(interval)
	}, [])

	// Fetching posts according to the list of their id, because we update list of id every 1 minute
	useEffect(() => {
		setLoading(true)

		fetchPosts()
	}, [idList])

	const handleRefresh = useMemo(() => () => {
		setLoading(true)
		fetchIds()
		// Resetting posts fetch interval to avoid accidental updates in less than 1 minute
		if (fetchInterval) {
			clearInterval(fetchInterval)
			const interval = setInterval(fetchIds, 60000)
			setFetchInterval(interval)
		}
	}, [fetchInterval])

	return (
		<>
			<Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}} py='0.5em'>
				<Typography variant='h5'>Newest posts:</Typography>
				<Tooltip title='Refresh posts list'>
					<IconButton sx={{color: 'inherit', mr: 0, ml: 'auto'}} size='large' disabled={loading} onClick={handleRefresh}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<Divider />
			{loading
				? <Box py='1em' display='flex' justifyContent='center'>
					<CircularProgress color='inherit' />
				</Box>
				: error
					? <Snackbar open={!!error} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
						<Alert severity='error' sx={{width: '100%'}} variant='filled'>
							{error}
						</Alert>
					</Snackbar>
					: <List>
						{posts.map((post, i) => <ListItem key={post.id}>
								<ListItemButton href={`${post.id}`}>
									<ListItemText
										primary={post.title}
										secondary={<>
											<Typography
												sx={{display: 'inline'}}
												component='span'
												variant='body2'
												color='text.primary'
											>
												Author:{' '}
											</Typography>
											@{post.by} |
											<Typography
												sx={{display: 'inline'}}
												component='span'
												variant='body2'
												color='text.primary'
											>
												{' '}Created at:{' '}
											</Typography>
											{formatDate(new Date(post.time * 1000))} | <Link
											href={post.url}
											target='_blank'
										>Open post</Link> |
											<Typography
												sx={{display: 'inline'}}
												component='span'
												variant='body2'
												color='text.primary'
											>
												{' '}Rating:{' '}
											</Typography>
											{post.score}
										</>}
									/>
								</ListItemButton>
							</ListItem>
						)}
					</List>}
		</>
	)
}

export default HomePage
