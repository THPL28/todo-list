import { useEffect, useState } from "react"
import { createCategory, fetchCategories } from "../services/categories"

export default function CategoryForm() {
  const [name, setName] = useState("")
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data.results || [])
      } catch (err) {
        setError("Não foi possível carregar categorias.")
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      const created = await createCategory({ name })
      setCategories((prev) => [...prev, created])
      setName("")
    } catch (err) {
      setError("Erro ao criar categoria.")
    }
  }

  return (
    <div>
      <h2>Categorias</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nova categoria"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button type="submit">Criar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  )
}
