import Link from 'next/link'

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map((item) => {
      return (
        <li key={item.href} className='nav-item'>
          <Link href={item.href} className='nav-link'>
            {item.label}
          </Link>
        </li>
      )
    })

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link className='navbar-brand' href='/'>
        GitTix
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  )
}
