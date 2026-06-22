import { useEffect, useState } from 'react'
import { Container, Card, Spinner, Alert, Button, Form, ListGroup, Image } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth'

const PostDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadComments = () => {
        api.get(`/posts/${id}/comments`)
            .then((data) => setComments(data.comments || []))
            .catch(() => setComments([]))
    }

    useEffect(() => {
        api.get(`/post/${id}`)
            .then((data) => setPost(data.post))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
        loadComments()
    }, [id])

    const addComment = async (e) => {
        e.preventDefault()
        if (!text.trim()) {
            return
        }
        try {
            await api.post(`/posts/${id}/comments`, { comment: text })
            setText('')
            loadComments()
        } catch (err) {
            setError(err.message)
        }
    }

    const deleteComment = async (commentId) => {
        try {
            await api.del(`/posts/${id}/comments/${commentId}`)
            loadComments()
        } catch (err) {
            setError(err.message)
        }
    }

    const deletePost = async () => {
        try {
            await api.del(`/post/${id}`)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        )
    }

    if (error && !post) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>
    }

    const isAuthor = user && post.author && (post.author._id === user._id)

    return (
        <Container style={{ maxWidth: 760 }} className="mt-4">
            <Button variant="link" className="ps-0 mb-2" onClick={() => navigate('/')}>← Voltar</Button>
            <Card className="shadow-sm mb-4">
                <Card.Img variant="top" src={post.cover} style={{ maxHeight: 320, objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Subtitle className="text-muted mb-2">{post.category}</Card.Subtitle>
                    <Card.Title as="h2">{post.title}</Card.Title>
                    {post.author && (
                        <p className="text-muted small">por {post.author.firstName} {post.author.lastName}</p>
                    )}
                    <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Card.Text>
                    {isAuthor && (
                        <Button variant="outline-danger" size="sm" onClick={deletePost}>Excluir post</Button>
                    )}
                </Card.Body>
            </Card>

            <h4 className="mb-3">Comentários ({comments.length})</h4>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={addComment} className="mb-3 d-flex gap-2">
                <Form.Control
                    placeholder="Escreva um comentário..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button type="submit">Enviar</Button>
            </Form>

            <ListGroup>
                {comments.length === 0 && <p className="text-muted">Nenhum comentário ainda.</p>}
                {comments.map((c) => (
                    <ListGroup.Item key={c._id} className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-2">
                            {c.author && c.author.avatar && (
                                <Image src={c.author.avatar} roundedCircle width={36} height={36} style={{ objectFit: 'cover' }} />
                            )}
                            <div>
                                {c.author && (
                                    <strong className="d-block">{c.author.firstName} {c.author.lastName}</strong>
                                )}
                                <span>{c.comment}</span>
                            </div>
                        </div>
                        {user && c.author && c.author._id === user._id && (
                            <Button variant="link" className="text-danger p-0" onClick={() => deleteComment(c._id)}>
                                excluir
                            </Button>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    )
}

export default PostDetail
