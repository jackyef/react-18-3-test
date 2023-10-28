// @ts-expect-error `cache` isn't in @types/react yet
import { ReactNode, Suspense, cache, memo } from "react";
import { ErrorBoundary, ErrorProps } from "../ErrorBoundary";

type Props = { name: string }

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{children}</div>
  )
}

const getPokemonByName = cache(async (name: string) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const json = await res.json();

  return json
})


const Error = ({ error, onDismissError }:ErrorProps) => {
  return (
    <Container>
      <div>
        {error?.toString()}
      </div>
      <button onClick={onDismissError}>Try again</button>
    </Container>
  )
}

const Loader = () => <Container>Loading...</Container>

const UI = async ({ name }: Props) => {
  const pokemon = await getPokemonByName(name)

  return (
    <Container>
      <figure>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <figcaption>{pokemon.name}</figcaption>
      </figure>
    </Container>
  );
}

// `memo` is needed, we will be rendering the <Loader /> for a brief period
// everytime the component is rendered 
export const Pokemon = memo(({ name }: Props) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={Error}>
        {/* @ts-expect-error async client component */}
        <UI name={name} />
      </ErrorBoundary>
    </Suspense>
  )
});
