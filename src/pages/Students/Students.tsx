import { Link } from 'react-router-dom'
import { Fragment } from 'react'
import { deleteStudent, getAllStudents, getStudent } from 'apis/student.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryString } from 'utils/util'
import classNames from 'classnames'
import { toast } from 'react-toastify'

const LIMIT = 10

const Students = () => {
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  const queryClient = useQueryClient()

  const studentsQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => getAllStudents(page, LIMIT),
    keepPreviousData: true
  })

  const totalStudents = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPages = Math.ceil(totalStudents / LIMIT)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => {
      return deleteStudent(id)
    },
    onSuccess: (_, id) => {
      toast.success(`Delete Successfully Student with ID = ${id}`)
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
    }
  })

  const handleDelete = (id: number) => {
    deleteStudentMutation.mutate(id)
  }

  const handlePrefetchStudent = (id: number) => {
    queryClient.prefetchQuery(['student', String(id)], {
      queryFn: () => getStudent(id),
      staleTime: 10 * 1000
    })
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <Link
        to={'/students/create'}
        type='button'
        className='mb-1 mr-2 mt-3 rounded-full bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 
        focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
      >
        Create
      </Link>
      {studentsQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!studentsQuery.isLoading && (
        <Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    #
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Avatar
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Email
                  </th>
                  <th scope='col' className='px-6 py-3 text-center'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery.data?.data.map((student) => (
                  <tr
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={() => handlePrefetchStudent(student.id)}
                  >
                    <td className='px-6 py-4'>{student.id}</td>
                    <td className='px-6 py-4'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='px-6 py-4'>{student.email}</td>
                    <td className='flex justify-center px-6 py-4 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span
                      className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                    >
                      Previous
                    </span>
                  ) : (
                    <Link
                      className='cursor-pointer rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight
                       text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPages)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300  px-3 py-2 leading-tight  hover:bg-gray-100 hover:text-gray-700',
                            {
                              'bg-gray-700 text-gray-100': page === pageNumber,
                              'bg-white text-gray-500': page !== pageNumber
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}
                <li>
                  {page === totalPages ? (
                    <span
                      className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                    >
                      Next
                    </span>
                  ) : (
                    <Link
                      className='cursor-pointer rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight
                       text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
  )
}
export default Students
