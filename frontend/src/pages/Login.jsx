import { useState, useEffect } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth'
import { API_URL } from '../api'

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const { login, loginWithToken } = useAuth()
    const navigate = useNavigate()
    const [params] = useSearchParams()

    useEffect(() => {
        const token = params.get('token')
        if (token) {
            loginWithToken(token).then(() => navigate('/'))
        }
        if (params.get('error')) {
            setError('Falha no login com Google')
        }
    }, [])

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await login(form.email, form.password)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <Container style={{ maxWidth: 420 }} className="mt-5">
            <Card className="p-4 shadow-sm">
                <h3 className="mb-3">Login</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={form.email} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={onChange} required />
                    </Form.Group>
                    <Button type="submit" className="w-100 mb-2">Entrar</Button>
                </Form>
                <Button
                    variant="light"
                    className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2 border"
                    href={`${API_URL}/auth/google`}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
                        <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z" />
                        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
                    </svg>
                    Continuar com Google
                </Button>
                <div className="text-center mt-2">
                    Não tem conta? <Link to="/register">Cadastre-se</Link>
                </div>
            </Card>
        </Container>
    )
}

export default Login
