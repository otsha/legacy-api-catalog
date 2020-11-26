import React from 'react'
import Link from 'next/link'

const Navigation = ({ categories, currentCategory }) => {
  return (
    <nav>
      {categories.map(cat =>
        <Link
          key={cat.name}
          href={`/${cat.name.toLowerCase()}`}>
          <a className={cat.name.toLowerCase() === currentCategory ? 'nav-link active-category' : 'nav-link'}>
            {cat.name}
          </a>
        </Link>
      )}
    </nav>
  )
}

export default Navigation
