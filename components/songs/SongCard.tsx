import Link from 'next/link';
import { Song } from '@/types/domain';

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  return (
    <article className="surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-white">{song.title}</h3>
        <span className="rounded-full border border-border px-2 py-1 text-xs uppercase text-slate-300">
          {song.type}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">Sanatçı: {song.artist}</p>
      <p className="mt-3 text-sm text-slate-300">{song.lyrics_or_notes}</p>
      <Link href={song.youtube_url} target="_blank" className="mt-4 inline-block text-sm text-accent">
        YouTube Kaynağını Aç
      </Link>
    </article>
  );
}
