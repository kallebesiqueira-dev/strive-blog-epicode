import { useState } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth'

const Register = () => {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await api.post('/users', form, { auth: false })
            await login(form.email, form.password)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <Container style={{ maxWidth: 420 }} className="mt-5">
            <Card className="p-4 shadow-sm">
                <h3 className="mb-3">Cadastro</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control name="firstName" value={form.firstName} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sobrenome</Form.Label>
                        <Form.Control name="lastName" value={form.lastName} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={form.email} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={onChange} minLength={8} required />
                    </Form.Group>
                    <Button type="submit" className="w-100">Criar conta</Button>
                </Form>
                <div className="text-center mt-3">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </div>
            </Card>
        </Container>
    )
}

export default Register
