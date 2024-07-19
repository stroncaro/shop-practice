interface SearchBoxProps {
  onInput: React.FormEventHandler<HTMLInputElement>;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onInput }) => {
  return (
    <input type="search" onInput={onInput} />
  );
};
