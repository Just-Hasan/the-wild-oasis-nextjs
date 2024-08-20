import { getCountries, getGuest } from "@/app/_lib/data-service";
import { auth } from "../_lib/auth";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();
  const { user } = await auth();
  const data = await getGuest(user.email);
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <select
      defaultValue={`${data.nationality}%${flag}`}
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      className={className}
    >
      <option>{data.nationality}</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
