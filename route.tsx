import { PersonType } from "@/types/global";
import type { NextRequest } from "next/server";

async function fetchPerson(id: string): Promise<PersonType> {
	const res = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	return await res.json();
}

export async function GET(
    _req: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const person = await fetchPerson(id);
    
    // ကျန်တဲ့ code တွေ ဆက်ရေးပါ...
    return Response.json(person);
}
