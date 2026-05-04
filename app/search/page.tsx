import Movie from "@/components/movie";
import { MovieType } from "@/types/global";

async function fetchSearch(q: string): Promise<MovieType[]> {
	const res = await fetch(
		`https://api.themoviedb.org/3/search/movie?query=${q}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
			},
		},
	);

	const data = await res.json();
	return data.results;
}

export default async function Search({
	searchParams,
}: {
	searchParams: Promise<{ q: string }>;
}) {
	const q = (await searchParams).q;
	const movies = await fetchSearch(q);

	return (
		<div>
			<h2 className="py-4 mb-4 border-b text-xl font-bold">
				Search: {q}
			</h2>
			<div className="flex flex-wrap gap-3">
				{movies.map(movie => {
					return (
						<Movie
							key={movie.id}
							movie={movie}
						/>
					);
				})}
			</div>
		</div>
	);
}
