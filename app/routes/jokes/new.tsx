import { Form } from 'remix'

export default function NewJokeRoute() {
  return (
    <div>
      <h2>Add your own jokes</h2>
      <Form>
        <div>
          <label htmlFor='name'>Name: </label>
          <input type='text' name='name' />
        </div>
        <div>
          <label htmlFor='content'>Content: </label>
          <textarea rows={10} name='content'></textarea>
        </div>
        <div>
          <button type='submit' className='button'>
            Add Joke
          </button>
        </div>
      </Form>
    </div>
  )
}
