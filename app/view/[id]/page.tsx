import { MovieType, PersonType } from "@/types/global";
import Link from "next/link";
import Image from "next/image";

async function fetchVideo(id: string): Promise<string | null> {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
        });
        const data = await res.json();
        const trailer = data.results?.find(
            (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        return trailer ? trailer.key : data.results?.[0]?.key || null;
    } catch (error) {
        return null;
    }
}

async function fetchCast(id: string): Promise<PersonType[]> {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
        }
    );
    const data = await res.json();
    return data.cast.slice(0, 20); 
}

async function fetchMovie(id: string): Promise<MovieType> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        next: { revalidate: 3600 } // ၁ နာရီအတွင်း တစ်ခါပဲ ခေါ်မယ်
    });
    return await res.json();
}

const backdropUrl = "https://image.tmdb.org/t/p/w780";
const profileUrl = "https://image.tmdb.org/t/p/w185";

export default async function MovieView({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movie = await fetchMovie(id);
    const cast = await fetchCast(id);
    const videoKey = await fetchVideo(id);

    // Date ကို အပြင်မှာ ကြိုထုတ်ထားခြင်းဖြင့် Hydration error ကို လျှော့ချနိုင်ပါတယ်
    const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

    return (
        <div className="pb-10 px-4 md:px-0">
            <h2 className="py-4 mb-4 border-b text-2xl font-bold">
                {movie.title} ({releaseYear})
            </h2>
            
            <div className="relative w-full h-[300px] md:h-[450px] mb-6">
                <Image
                    src={backdropUrl + movie.backdrop_path}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    priority
                />
            </div>

            <div className="text-lg leading-relaxed mb-8 text-gray-700">
                <p className="font-semibold text-xl mb-2 text-black">Overview</p>
                {/* movie.overview ကို p tag နဲ့ ပတ်ပေးခြင်းက HTML nesting ကို ပိုမှန်စေပါတယ် */}
                <p>{movie.overview}</p>
            </div>

            {videoKey && (
                <div className="mb-10">
                    <h2 className="py-4 mb-4 border-b text-xl font-bold">Official Trailer</h2>
                    <div className="relative w-full aspect-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-md border-0"
                            allowFullScreen
                            title="YouTube Movie Trailer"
                        ></iframe>
                    </div>
                </div>
            )}

            <h2 className="py-4 mb-4 border-b text-xl font-bold">Cast</h2>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {cast.map(person => (
                    <div key={person.id} className="w-32 text-center">
                        <div className="relative w-32 h-48 mb-2 overflow-hidden rounded-md shadow hover:shadow-lg transition-shadow">
                            {person.profile_path ? (
                                <Image
                                    src={profileUrl + person.profile_path}
                                    alt={person.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 italic text-center px-2">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="text-sm font-bold leading-tight">
                            <Link href={`/person/${person.id}`} className="hover:text-blue-600 transition-colors">
                                {person.name}
                            </Link>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 italic">
                            {person.character}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}