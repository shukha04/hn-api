import { Alert, Box, CircularProgress, Paper, Snackbar, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import formatDate from '../tools/formatDate'
import Comment from '../types/Comment'

type CommentsListProps = {
	commentIds: number[],
	child?: boolean
	setCommentsCount: (count: number) => void
}

const CommentsList: FC<CommentsListProps> = ({commentIds, child, setCommentsCount}) => {
	const [comments, setComments] = useState<Comment[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const fetchComments = () => {
		// Creating multiple requests using promise.all and array of kids id
		Promise.all(commentIds.map((id) => {
				return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((res) => res.json())
			}))
			.then((data: Comment[]) => {
				setError(null)
				setComments(data)
			})
			.catch((err) => {
				setError(err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	// Fetching comments on page mount
	useEffect(() => {
		setLoading(true)

		fetchComments()
	}, [])

	// Changing comments count on page mount
	useEffect(() => {
		setCommentsCount(comments.length)
	}, [comments.length])

	return loading
		? <Box py='1em' display='flex' justifyContent='center'>
			<CircularProgress color='inherit' />
		</Box>
		: error
			? <Snackbar open={!!error} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
				<Alert severity='error' sx={{width: '100%'}} variant='filled'>
					{error}
				</Alert>
			</Snackbar>
			: comments && comments.length > 0
				? <>
					{comments.map((comment) =>
						<Paper sx={{my: '1em', p: '0.5em 1em', ml: child ? '1em' : ''}} variant='outlined'>
							<Typography variant='h6'>@{comment.by}</Typography>
							{/* Needed to add dangerouslySetHTML because comment.text includes html tags */}
							<Typography dangerouslySetInnerHTML={{__html: comment.text}} my='1em' variant='body2' />
							<Typography
								variant='caption'
								textAlign='end'
								display='block'
							>{formatDate(new Date(comment.time * 1000))}</Typography>
							{comment.kids && comment.kids.length > 0 ? <CommentsList
								commentIds={comment.kids}
								child
								setCommentsCount={setCommentsCount}
							/> : null}
						</Paper>
					)}
				</>
				:
				<Alert severity='info' sx={{width: '100%', my: '1em'}} variant='outlined'>
					No comments yet.
				</Alert>
}

export default CommentsList
