import Link from 'next/link'
const PORTFOLIO_URL = process.env.PORTFOLIO_URL;
const GITHUB_URL = process.env.GITHUB_URL;
const LINKEDIN_URL = process.env.LINKEDIN_URL;

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Fileo</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <a 
              href={PORTFOLIO_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Portfolio
            </a>
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            <a 
              href={LINKEDIN_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              LinkedIn
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
} 