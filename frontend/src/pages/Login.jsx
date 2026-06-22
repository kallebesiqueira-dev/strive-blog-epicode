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
                <Button variant="outline-danger" className="w-100 mb-2" href={`${API_URL}/auth/google`}>
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
