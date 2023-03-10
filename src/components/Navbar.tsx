import NewspaperIcon from '@mui/icons-material/Newspaper'
import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { FC } from 'react'

const Navbar: FC = () => {
	return (
		<AppBar position='relative'>
			<Container>
				<Toolbar disableGutters>
					<NewspaperIcon
						sx={{
							mr: 2
						}}
					/>
					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/'
						sx={{
							fontFamily: 'monospace',
							fontWeight: 700,
							color: 'inherit',
							textDecoration: 'none',
							letterSpacing: '.1rem'
						}}
					>
						Hacker News
					</Typography>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default Navbar
