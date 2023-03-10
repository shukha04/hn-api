export default interface Post {
	id: number
	title: string
	score: number
	by: string
	time: number
	url: string
	kids?: number[]
}
