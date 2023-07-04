import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createStudent, getStudent, updateStudent } from 'apis/student.api'
import { Link, useMatch, useParams } from 'react-router-dom'
import { Student } from 'types/student.type'
import { Fragment, useMemo, useState, useEffect } from 'react'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'

type StudentType = Omit<Student, 'id'> | Student

type ValidateType =
  | {
      [key in keyof StudentType]: string
    }
  | null

const initialState: StudentType = {
  first_name: '',
  last_name: '',
  email: '',
  gender: 'other',
  country: '',
  avatar: '',
  btc_address: ''
}

const CreateStudent = () => {
  const [student, setStudent] = useState<StudentType>(initialState)

  const createMatch = useMatch('/students/create')
  const isCreateMode = Boolean(createMatch)

  const queryClient = useQueryClient()

  const { id } = useParams()

  const studentQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    staleTime: 10 * 1000,
    enabled: id !== undefined
  })

  useEffect(() => {
    if (studentQuery.data) {
      setStudent(studentQuery.data.data)
    }
  }, [studentQuery.data])

  const createStudentMutation = useMutation({
    mutationFn: (body: StudentType) => {
      return createStudent(body)
    }
  })

  const updateStudentMutation = useMutation({
    mutationFn: (_) => {
      return updateStudent(id as string, student as Student)
    }
  })

  const validate: ValidateType = useMemo(() => {
    const error = isCreateMode ? createStudentMutation.error : updateStudentMutation.error
    if (isAxiosError<{ error: ValidateType }>(error) && error.response?.status === 422) {
      return error.response?.data.error
    }
    return null
  }, [isCreateMode, createStudentMutation.error, updateStudentMutation.error])

  const handleChange = (name: keyof StudentType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudent((prev) => ({ ...prev, [name]: event.target.value }))
    if (createStudentMutation.error || createStudentMutation.data) {
      createStudentMutation.reset()
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isCreateMode) {
      createStudentMutation.mutate(student, {
        onSuccess: () => {
          toast.success('Created Successfully')
          setStudent(initialState)
        }
      })
    } else {
      updateStudentMutation.mutate(undefined, {
        onSuccess: (data) => {
          toast.success('Updated Successfully')
          setStudent(initialState)
          queryClient.setQueryData(['student', id], data)
        }
      })
    }
  }

  return (
    <div>
      <h1 className='text-lg'>{isCreateMode ? 'Create' : 'Update'} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm  focus:border-blue-600 focus:outline-none focus:ring-0 '
            placeholder=' '
            value={student.email}
            onChange={handleChange('email')}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Email address
          </label>
          {validate && <p className='mt-2 text-sm text-red-600'>{validate.email}</p>}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  value='Male'
                  checked={student.gender === 'Male'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 '
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  value='Female'
                  checked={student.gender === 'Female'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 '
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  value='Agender'
                  checked={student.gender === 'Agender'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 '
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm  focus:border-blue-600 focus:outline-none focus:ring-0 '
            placeholder=' '
            value={student.country}
            onChange={handleChange('country')}
            required
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
              placeholder=' '
              value={student.first_name}
              onChange={handleChange('first_name')}
              required
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
              placeholder=' '
              value={student.last_name}
              onChange={handleChange('last_name')}
              required
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
              placeholder=' '
              value={student.avatar}
              onChange={(event) => setStudent((prev) => ({ ...prev, avatar: event.target.value }))}
              required
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Avatar
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
              placeholder=' '
              value={student.btc_address}
              onChange={handleChange('btc_address')}
              required
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              BTC Address
            </label>
          </div>
        </div>
        {isCreateMode && (
          <Fragment>
            <button
              type='submit'
              className='mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
            >
              Submit
            </button>
            <Link
              to={'/students'}
              type='reset'
              className='rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300'
            >
              Back
            </Link>
          </Fragment>
        )}
        {!isCreateMode && (
          <Fragment>
            <button
              type='submit'
              className='mr-2 rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300'
            >
              Update
            </button>
            <Link
              to={'/students'}
              type='reset'
              className='rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300'
            >
              Back
            </Link>
          </Fragment>
        )}
      </form>
    </div>
  )
}

export default CreateStudent
