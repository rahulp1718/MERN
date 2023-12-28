const Button = ({ onHandleSubmit, buttonText, className = "" }) => {
  return (
    <>
      <button
        className={`bg-[#3468FA] font-semibold ${className}`}
        onClick={onHandleSubmit}
      >
        {buttonText}
      </button>
    </>
  );
};

export default Button;
