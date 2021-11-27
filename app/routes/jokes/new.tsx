import { ActionFunction, Form, redirect, useActionData } from 'remix'
import { db } from '~/utils/db.server'

function validateJokeContent(content: string) {
  if (content.length < 11) return 'That joke is too short'
}

function validateJokeName(name: string) {
  if (name.length < 4) return 'That name is too short'
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    content: string | undefined
  }
  fields?: {
    name: string
    content: string
  }
}

export let action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  let form = await request.formData()
  let name = form.get('name')
  let content = form.get('content')
  if (typeof name !== 'string' || typeof content !== 'string') {
    return { formError: 'Form not submitted correctly.' }
  }
  let fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  }
  let fields = { name, content }

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields }
  }
  let joke = await db.joke.create({
    data: fields,
  })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  let actionData = useActionData()
  return (
    <div>
      <h2>Add your own jokes</h2>
      <Form method='post'>
        <div>
          <label htmlFor='name'>Name: </label>
          <input
            type='text'
            name='name'
            defaultValue={actionData?.fields?.name}
            aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
            aria-describedby={
              actionData?.fieldErrors?.name ? 'name-error' : undefined
            }
          />
          {actionData?.fieldErrors?.name ? (
            <p className='form-validation-error' role='alert' id='name-error'>
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor='content'>Content: </label>
          <textarea
            rows={10}
            name='content'
            defaultValue={actionData?.fields?.content}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.content) || undefined
            }
            aria-describedby={
              actionData?.fieldErrors?.content ? 'content-error' : undefined
            }
          ></textarea>
          {actionData?.fieldErrors?.content ? (
            <p
              className='form-validation-error'
              role='alert'
              id='content-error'
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
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
