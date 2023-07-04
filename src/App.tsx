import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Spinner from 'components/Spinner/Spinner'
import MainLayout from 'layouts/MainLayout'
import About from 'pages/About'
import CreateStudent from 'pages/CreateStudent'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/NotFound'
import Students from 'pages/Students'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  return (
    <div className='App'>
      {isFetching + isMutating !== 0 && <Spinner />}
      <ToastContainer />
      <MainLayout>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/students' element={<Students />}></Route>
          <Route path='/students/:id' element={<CreateStudent />} />
          <Route path='/students/create' element={<CreateStudent />} />
          <Route path='/about' element={<About />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </MainLayout>
    </div>
  )
}

export default App
