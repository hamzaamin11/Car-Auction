export const Options = ({ datas, placeHolder, ...props }) => {
  return (
    <div>
      <select className="border p-2 rounded w-full" {...props}>
        <option value={""}>{placeHolder}</option>

        {datas.map((data) => (
          <option key={data.value} value={data.value}>
            {data.label}
          </option>
        ))}
      </select>
    </div>
  );
};
