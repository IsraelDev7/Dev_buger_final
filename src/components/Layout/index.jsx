import { Outlet } from 'react-router-dom'
import Header from '../Header/index.jsx'
import Footer from '../Footer/index.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
