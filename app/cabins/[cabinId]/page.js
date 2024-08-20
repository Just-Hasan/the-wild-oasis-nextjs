import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// why's metadata so important? because for SEO and performance
export async function generateMetadata({ params }) {
  const cabin = await getCabin(params.cabinId);

  // metode optimisasi untuk mengatasi kondisi BLOCKING WATERFALL
  // const [cabin, settings, bookedDates] = await Promise.all([
  //   getCabin(params.cabinId),
  //   getSettings(),
  //   getBookedDatesByCabinId(params.cabinId),
  // ]);

  const title = cabin.name;

  return {
    title: `Cabin ${title}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => {
    return { cabinId: String(cabin.id) };
  });

  return ids;
}

export default async function Page({ params }) {
  const cabin = await getCabin(params.cabinId);
  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl mb-10 text-accent-400 font-semibold text-center">
          Reserve cabin {name} today. Pay on arrival.
        </h2>
        {/* We wrap the reservation component in a suspense to 'stream' it, the term 'stream' is used here because basically the component in the fallback property of the suspense will be shown while the reservations is still suspending or still loading or still fetching it's data */}
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
