import { useEffect, useState, useRef } from "react"
import { MainLayout } from "../layouts/MainLayout"
import { RecentTask } from "../componenets/RecentTask"
import { LoaderRing } from "../componenets/Loader"
import { getTodos, getTodosSearch } from "../utils/api"
import { ButtonAdd } from "../componenets/ButtonAdd"
import { Link } from "react-router-dom"
import LeftArrow from "../assets/icon/leftarrow.png"
import { TodoSkeleton } from "../componenets/skeleton/TodoSkeleton"

export const Todos = () => {
    const [todos, setTodos] = useState([])
    const [filteredTodos, setFilteredTodos] = useState([])
    const [loading, setLoading] = useState(true) // Initial loading for first fetch
    const [error, setError] = useState(null)

    const [keyword, setKeyword] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedDate, setSelectedDate] = useState('')

    const fetchData = async (searchKeyword = '') => {
        try {
            setLoading(true)
            const data = await getTodos()
            setTodos(data)
            setError(null)
        } catch (err) {
            setError('Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData() // Initial data fetch
    }, [])

    useEffect(() => {
        const filtered = todos.filter(item => {
            const matchKeyword = item.title.toLowerCase().includes(keyword);
            const matchStatus = selectedStatus ? item.status === selectedStatus : true;
            const matchCategory = selectedCategory
                ? item.categories?.some(category => String(category.id) === selectedCategory)
                : true;
            const matchDate = selectedDate ? item.created_at?.startsWith(selectedDate) : true;
            return matchCategory && matchDate && matchStatus && matchKeyword;
        });
        setFilteredTodos(filtered);
    }, [selectedStatus, selectedDate, selectedCategory, keyword, todos]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>
    return (
        <MainLayout>
            <div className="flex flex-col justify-center items-center gap-2 p-2">
                <div className="w-[90%] flex flex-col items-start my-2 gap-2 rounded-2xl justify-between">
                    <div className="flex p-2 bg-sky-400 rounded-lg text-white items-center">
                        <img src={LeftArrow} alt="" className="w-6 aspect-square" />
                        <Link to='/dashboard' className="">Back to dashboard</Link>
                    </div>
                    <h1 className="text-2xl font-bold">All your to-dos</h1>
                    <div className="w-full">
                        <input
                            type="text"
                            className="w-full p-2 border-2 rounded-xl border-b-6 border-sky"
                            placeholder="Search To-dos By Title"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />

                    </div>
                    <div className="w-full flex flex-col gap-2 mt-2 md:flex-row">
                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="md:w-1/3 p-2 border-2 rounded-xl border-b-6 border-sky">
                            <option value="">Choose Status</option>
                            <option value="Not started">Not Started</option>
                            <option value="In progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="md:w-1/3 p-2 border-2 rounded-xl border-b-6 border-sky">
                            <option value="">Choose Category</option>
                            <option value="1">Task</option>
                            <option value="2">Work</option>
                            <option value="3">Study</option>
                            <option value="4">Personal</option>
                            <option value="5">Money</option>
                            <option value="6">Sosial</option>
                            <option value="7">Health</option>
                            <option value="8">Hoby</option>
                            <option value="9">Productivity</option>
                        </select>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="p-2 border-2 rounded-xl border-b-6 border-sky md:w-1/3"
                        />
                    </div>
                </div>
                <div>
                    {loading ? <TodoSkeleton /> : <RecentTask dataTodos={filteredTodos ? filteredTodos : todos} />}
                </div>
            </div>
            <ButtonAdd />
        </MainLayout>
    )
}