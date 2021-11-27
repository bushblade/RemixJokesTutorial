import { Joke } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'

export let loader: LoaderFunction = async () => {
  let count = await db.joke.count()
  let randomNumber = Math.floor(Math.random() * count)
  let [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomNumber,
  })
  let data: Joke = randomJoke
  return data
}

export default function JokesIndexRoute() {
  let joke = useLoaderData() as Joke
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
      <Link to={joke.id}>{joke.name} Permalink</Link>
    </div>
  )
}
