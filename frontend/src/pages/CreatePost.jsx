import { useState } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { api, uploadImage } from '../api'
import { useAuth } from '../auth'

const CreatePost = () => {
    const [form, setForm] = useState({ title: '', category: '', content: '' })
    const [file, setFile] = useState(null)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)
        try {
            let cover
            if (file) {
                cover = await uploadImage(file)
            }

            const payload = { ...form, author: user._id }
            if (cover) {
                payload.cover = cover
            }

            const { post } = await api.post('/posts', payload)
            navigate(`/posts/${post._id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <Container style={{ maxWidth: 640 }} className="mt-4">
            <Card className="p-4 shadow-sm">
                <h3 className="mb-3">Novo Post</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control name="title" value={form.title} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control name="category" value={form.category} onChange={onChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Capa (opcional)</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Conteúdo</Form.Label>
                        <Form.Control as="textarea" rows={6} name="content" value={form.content} onChange={onChange} required />
                    </Form.Group>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Publicando...' : 'Publicar'}
                    </Button>
                </Form>
            </Card>
        </Container>
    )
}

export default CreatePost
