const InputBox = ({
  type,
  onHandleChange,
  inputValue,
  placeholder,
  className = "",
}) => {
  return (
    <>
      <input
        type={type}
        onChange={onHandleChange}
        placeholder={placeholder}
        value={inputValue}
        className={`bg-white w-full p-2 text-sm ${className}`}
      />
    </>
  );
};

export default InputBox;
