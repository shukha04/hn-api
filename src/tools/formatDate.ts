// Function to format date into MM/dd/yyyy hh:mm:ss
const formatDate = (date: Date) => [
		(date.getMonth() + 1),
		date.getDate(),
		date.getFullYear()
	].join('/') + ' ' +
	[
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	].join(':')

export default formatDate
