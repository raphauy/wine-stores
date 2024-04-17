import Link from "next/link";

export default function Logo() {

  return (
    <Link href="/">
      <div className="text-2xl font-bold pl-3 flex py-2">
        <p className="text-gray-700 whitespace-nowrap dark:text-white">wine-stores</p> 
        <p className="text-gray-300">.com</p>
      </div>
    </Link>
  )
}
