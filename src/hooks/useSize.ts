import { type RefObject, useEffect, useState } from 'react'

// A custom hook to track the size of an element using ResizeObserver
export default function useSize(elementRef: RefObject<HTMLElement | null>) {
	const [size, setSize] = useState({
		width: elementRef.current?.offsetWidth || 0,
		height: elementRef.current?.offsetHeight || 0,
	})

	useEffect(() => {
		const handleResize = () => {
			if (elementRef.current) {
				// eslint-disable-next-line
				setSize({
					width: elementRef.current.offsetWidth,
					height: elementRef.current.offsetHeight,
				})
			}
		}

		const resizeObserver = new ResizeObserver(handleResize)

		handleResize()
		if (elementRef.current) {
			resizeObserver.observe(elementRef.current)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [elementRef])

	return size
}
