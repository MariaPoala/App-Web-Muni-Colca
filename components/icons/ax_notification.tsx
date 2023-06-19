import { BellIcon } from '@heroicons/react/outline'

export default function AxNotification({ styles = '' }: { styles?: string }) {
    return <button type="button" className={styles + " flex-shrink-0 p-1 rounded-full hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"} >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
    </ button>
}