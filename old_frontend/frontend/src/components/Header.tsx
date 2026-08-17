import { Link, NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { useAuth } from '../hooks/useAuth'
export function Header() { const { token, user, logout } = useAuth(); return <header className="header"><Logo /><nav><NavLink to="/">Téléverser</NavLink>{token ? <NavLink to="/espace">Mon espace</NavLink> : <Link className="header-login" to="/login">Se connecter</Link>}{token && <button className="logout" type="button" onClick={logout} aria-label={`Déconnexion de ${user?.email}`}>Déconnexion</button>}</nav></header> }
