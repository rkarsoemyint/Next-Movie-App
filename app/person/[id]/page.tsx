import { PersonType } from "@/types/global"; // သင့် types ထဲမှာ PersonType ရှိမယ်လို့ ယူဆပါတယ်
import Image from "next/image";

async function fetchPerson(id: string) {
    const res = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
    });
    return await res.json();
}

export default async function PersonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const person = await fetchPerson(id);

    const profileUrl = "https://image.tmdb.org/t/p/w500";

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image */}
                <div className="w-full md:w-1/3">
                    {person.profile_path ? (
                        <Image
                            src={profileUrl + person.profile_path}
                            alt={person.name}
                            width={500}
                            height={750}
                            className="rounded-xl shadow-lg"
                        />
                    ) : (
                        <div className="w-full h-[450px] bg-gray-200 rounded-xl flex items-center justify-center">
                            No Image Found
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/3">
                    <h1 className="text-4xl font-bold mb-4">{person.name}</h1>
                    
                    <div className="space-y-2 mb-6 text-gray-600">
                        <p><strong>Birthday:</strong> {person.birthday || "Unknown"}</p>
                        <p><strong>Place of Birth:</strong> {person.place_of_birth || "Unknown"}</p>
                        <p><strong>Department:</strong> {person.known_for_department}</p>
                    </div>

                    <h2 className="text-2xl font-semibold mb-2">Biography</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {person.biography || "No biography available for this person."}
                    </p>
                </div>
            </div>
        </div>
    );
}