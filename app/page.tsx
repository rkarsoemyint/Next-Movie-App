import Movie from "@/components/movie";
import { MovieType } from "@/types/global";

async function fetchPopular(): Promise<MovieType[]> {
    try {
        const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Fetch Popular Error:", error);
        return [];
    }
}

async function fetchNowPlaying(): Promise<MovieType[]> {
    try {
        const res = await fetch("https://api.themoviedb.org/3/movie/now_playing", {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Fetch Now Playing Error:", error);
        return [];
    }
}

export default async function Home() {
    
    const [popular, playing] = await Promise.all([
        fetchPopular(),
        fetchNowPlaying(),
    ]);

    return (
        <div className="space-y-8">
            <section>
                <h2 className="py-4 mb-4 border-b text-xl font-bold">Now Playing</h2>
                <div className="flex flex-wrap gap-3">
                    {playing.length > 0 ? (
                        playing.map((movie) => <Movie key={movie.id} movie={movie} />)
                    ) : (
                        <p className="text-gray-500">No movies found.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="py-4 mb-4 border-b text-xl font-bold">Popular</h2>
                <div className="flex flex-wrap gap-3">
                    {popular.length > 0 ? (
                        popular.map((movie) => <Movie key={movie.id} movie={movie} />)
                    ) : (
                        <p className="text-gray-500">No movies found.</p>
                    )}
                </div>
            </section>
        </div>
    );
}