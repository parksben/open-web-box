import { useEffect, useState } from 'react'

export function useRepoStar() {
	const [star, setStar] = useState<string>('')

	useEffect(() => {
		getRepoStar().then(setStar)
	}, [])

	return star
}

const STAR_API_URL = 'https://api.github.com/repos/parksben/open-web-box'

function getRepoStar() {
	return fetch(STAR_API_URL)
		.then((response) => response.json())
		.then((data) => formatStarCount(Number(data.stargazers_count)))
}

function formatStarCount(count: number | null) {
	if (count === null) return '...'
	if (count >= 1000) {
		return (count / 1000).toFixed(1) + 'k'
	}
	return count.toString()
}
