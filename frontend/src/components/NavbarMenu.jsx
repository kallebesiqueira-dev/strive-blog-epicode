import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

const NavbarMenu = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Strive Blog</Navbar.Brand>
                <Nav className="ms-auto align-items-center gap-2">
                    {user ? (
                        <>
                            <Nav.Link as={Link} to="/posts/new">Novo Post</Nav.Link>
                            <Nav.Link as={Link} to="/profile">{user.firstName}</Nav.Link>
                            <Button size="sm" variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Cadastro</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavbarMenu
