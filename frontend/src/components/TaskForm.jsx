import { useEffect, useState } from "react"
import { createTask } from "../services/tasks"
import { fetchCategories } from "../services/categories"

export default function TaskForm({ onTaskCreated, categoriesVersion }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchCategories()
        setCategories(data.results || [])
      } catch (err) {
        setError("Não foi possível carregar categorias.")
      }
    })()
  }, [categoriesVersion])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const task = await createTask({
        title,
        description,
        due_date: dueDate || null,
        category: category || null,
      })
      onTaskCreated?.(task)
      setTitle("")
      setDescription("")
      setDueDate("")
      setCategory("")
    } catch (err) {
      setError("Erro ao criar tarefa.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Nova Tarefa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Selecione uma categoria</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button type="submit">Criar tarefa</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
