import Image from "next/image";
import Link from "next/link";


type Props= {
  name: string,
  imageUrl?: string
}
export default async function LogoStore({ name, imageUrl }: Props) {

  return (
    <Link href="/">
      <div className="text-2xl font-bold pl-3 flex py-2">
        <div className="flex items-center gap-2">
          {imageUrl && <Image src={imageUrl} alt={name} width={60} height={60} className="rounded-full" />}
          <p className="text-gray-700 whitespace-nowrap dark:text-white">{name}</p>
        </div>
      </div>
    </Link>
  )
}
