import { Container } from '@mui/material'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout: FC = () => {
	return (
		<>
			<Navbar />
			<Container>
				<Outlet />
			</Container>
		</>
	)
}

export default Layout
