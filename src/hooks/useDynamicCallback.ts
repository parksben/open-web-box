import { useRef } from 'react'

// A custom hook that creates a mutable ref object which intentionally bypasses React's dependency tracking
export function useDynamicRef<T>(value: T): { readonly current: T } {
	const valueRef = useRef<T>(value)
	const stableRef = useRef<{ readonly current: T } | null>(null)

	valueRef.current = value

	if (!stableRef.current) {
		const current = {
			get current() {
				return valueRef.current
			},
		}
		Object.freeze(current)
		stableRef.current = current
	}

	return stableRef.current
}

// A custom hook that returns a stable callback function that always uses the latest value of the callback
export default function useDynamicCallback<T extends (...args: any) => any>(callback: T): T {
	const callbackRef = useDynamicRef(callback)

	return ((...args: Parameters<T>) => {
		return callbackRef.current(...args)
	}) as T
}
