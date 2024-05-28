import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { LinealToggle } from './shadcn/toggle-theme';
import { Button } from './ui/button';

export default function Footer(){

  const isDevMode = process.env.NODE_ENV === "development";

  return (
    <footer className='flex-grow-0  bg-slate-50 dark:bg-black'>
      <MaxWidthWrapper>

        <div className='py-10 md:flex md:items-center md:justify-between'>
          <div className='text-center md:text-left'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>

          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8 items-center'>
              <Link
                href='/terminos'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Términos
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Política de privacidad
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Política de cookies
              </Link>
              <LinealToggle isDevMode={isDevMode} />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}


