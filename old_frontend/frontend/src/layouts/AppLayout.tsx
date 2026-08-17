import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
export function AppLayout({ children }: { children: React.ReactNode }) { return <div className="app-shell"><Header /><main>{children}</main><BottomNav /></div> }
