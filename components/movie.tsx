import Image from "next/image";
import Link from "next/link";
import { MovieType } from "@/types/global";

export default function Movie({ movie }: { movie: MovieType }) {
  // ရုပ်ရှင်တစ်ခုချင်းစီရဲ့ Detail page လမ်းကြောင်း (ဥပမာ - /movie/12345)
  const detailPath = `/view/${movie.id}`;
  const posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link href={detailPath} className="cursor-pointer">
      <div className="w-[200px] border rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        <div className="relative h-[300px] w-full overflow-hidden">
          <Image
            src={posterPath}
            alt={movie.title}
            width={300}
			height={450}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-2">
          <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-gray-500">{movie.release_date.split('-')[0]}</p>
        </div>
      </div>
    </Link>
  );
}